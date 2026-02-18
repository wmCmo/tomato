import { Navigate, useOutletContext } from "react-router";
import useAuth from "../hooks/useAuth";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import { useEffect, useRef, useState } from "react";
import useProfile from "../hooks/useProfile";
import { ArrowCircleRightIcon, PlusIcon } from "@phosphor-icons/react";
import { supabase } from "../lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import Error from "../components/Error";
import useConfirm from "../hooks/useConfirm";


const SettingPage = () => {
    const { session, user, loading: authLoading } = useAuth();

    const queryClient = useQueryClient();

    const { data: profile, isLoading, error } = useProfile(user?.id, {
        select: p => ({
            avatar_url: p.avatar_url,
            nickname: p.nickname
        })
    });

    const [formData, setFormData] = useState({
        nickname: "",
        avatar_url: ""
    });
    const [showDangerZone, setShowDangerZone] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        setFormData(prev => {
            const nextNickname = profile?.nickname ?? user?.user_metadata?.full_name ?? "";
            const nextAvatarUrl = profile?.avatar_url ?? `${import.meta.env.BASE_URL}profile-skeleton.svg`;
            return {
                ...prev,
                nickname: nextNickname,
                avatar_url: nextAvatarUrl
            };
        });
    }, [profile, user?.user_metadata?.full_name]);

    const { dict } = useOutletContext();
    const { confirm, modal } = useConfirm();

    if (authLoading) return <ProfileSkeleton />;

    if (!user) return <Navigate to={'/login'} replace />;

    if (isLoading) return <ProfileSkeleton />;

    if (error) {
        console.error(error);
        return <Error item={dict.setting.errorItem} />;
    }

    const fileName = `${user?.id}/avatar.webp`;

    // if (!profile) return <div>We had trouble getting your profile</div>;

    const DangerButton = ({ handleClick, content, isRed }) => {
        return <button onClick={handleClick} className={`text-sm py-2 rounded-md font-bold ${isRed ? 'bg-rose-200 text-rose-500' : 'bg-foreground text-muted-foreground icon hover:bg-extreme'}`}>{content}</button>;
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('active_session_id');
        localStorage.removeItem('defaults');
        localStorage.removeItem('session');
    };

    const handleLogout = async () => {
        // Always clear local auth state; this helps recover from corrupted/stale sessions.
        await supabase.auth.signOut({ scope: 'local' });
        queryClient.clear();
        clearLocalStorage();
    };

    const handleClearRecords = async () => {
        const ok = await confirm(dict.setting.clear.warning);
        if (!ok) return;
        await supabase
            .from('study_sessions')
            .delete()
            .eq('user_id', user.id);
        await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
        clearLocalStorage();
    };

    const handleDeleteAccount = async () => {
        const ok = await confirm(dict.setting.delete.warning);
        if (!ok) return;
        const { data, error } = await supabase.functions.invoke('delete-user', {
            body: { userId: user.id },
            headers: {
                "x-user-token": session.access_token
            }
        });
        if (error) {
            console.error("Failed to delete user:", error);
            return;
        }
        console.log("Sucessfully deleted the user", data);
        clearLocalStorage();
        await handleLogout();
    };

    const processAvatar = (file, maxSizeKB = 50) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = e => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const minSide = Math.min(img.width, img.height);

                    const OUTPUT_SIZE = 400;
                    canvas.width = OUTPUT_SIZE;
                    canvas.height = OUTPUT_SIZE;

                    const ctx = canvas.getContext('2d');

                    let sx = 0, sy = 0;
                    if (img.width > img.height) {
                        sx = (img.width - img.height) / 2;
                    } else {
                        sy = (img.height - img.width) / 2;
                    }

                    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

                    canvas.toBlob(blob => {
                        if (!blob) {
                            reject(new Error('Canvas is empty'));
                            return;
                        }
                        console.log(`Original: ${(file.size / 1024).toFixed(2)} KB`);
                        console.log(`Compressed: ${(blob.size / 1024).toFixed(2)} KB`);

                        if (blob.size > maxSizeKB * 1024) {
                            console.warn("Image slightly larger than target limit");
                        }
                        resolve(blob);
                    }, 'image/webp', 0.8);
                };
                img.onerror = error => reject(error);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const refreshPreviewAfterUpload = async () => {
        const file = fileInputRef.current.files?.[0];
        if (!file) return;

        try {
            const processedBlob = await processAvatar(file);
            const previewUrl = URL.createObjectURL(processedBlob);
            setFormData(prev => ({
                ...prev,
                avatar_url: previewUrl
            }));
        } catch (error) {

        }
    };

    const handleUploadFile = async () => {
        const file = fileInputRef.current.files?.[0];
        if (!file) return;

        try {
            const processedBlob = await processAvatar(file);

            const previewUrl = URL.createObjectURL(processedBlob);
            setFormData({ ...formData, avatar_url: previewUrl });
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, processedBlob, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            console.log("Upload complete!", previewUrl);
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Failed to upload image");
        }
    };

    const handleUpdateFormData = e => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const sendForm = async () => {
        let updateItem = { ...formData };
        if (formData.avatar_url !== profile.avatar_url) {
            try {
                await handleUploadFile();
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName);
                updateItem = { ...updateItem, avatar_url: publicUrl };

            } catch (error) {
                console.error("There was a problem getting your profile URL:", error);
                return;
            }
            setFormData(prev => ({
                ...prev,
                avatar_url: updateItem.avatar_url
            }));
        }

        if (formData.nickname !== profile.nickname) {
            updateItem = { ...updateItem, nickname: formData.nickname };
        }

        try {
            const { updateProfileURLError } = await supabase
                .from('profiles')
                .update(updateItem)
                .eq('id', user.id);
            if (updateProfileURLError) throw updateProfileURLError;
        } catch (error) {
            console.error("There was a problem updating your profile data", error);
            return;
        }

        queryClient.setQueryData(['profile', user.id], (old) => {
            if (!old) return old;
            return { ...old, ...formData };
        });
    };

    const handleCancleForm = () => {
        setFormData({
            nickname: profile?.nickname ?? "",
            avatar_url: profile?.avatar_url ?? `${import.meta.env.BASE_URL}profile-skeleton.svg`
        });
    };

    return (
        <div className="text-accent relative" >
            <section className="flex gap-8 items-end">
                <button className="relative" onClick={handleTriggerUpload}>
                    <img src={formData?.avatar_url ?? profile.avatar_url} className="h-20 w-auto rounded-lg" alt="User's profile picture" />
                    <div className="absolute top-0 grid place-items-center h-20 w-20 opacity-0 bg-accent rounded-lg hover:opacity-50">
                        <PlusIcon size={30} weight="bold" className="text-white z-10" />
                    </div>
                </button>
                <div className="space-y-2">
                    <h1 className="text-xl">{dict.setting.question}</h1>
                    <input className="px-4 py-2 outline-none card" type="text" name="nickname" id="nickname" value={formData?.nickname ?? ""} onChange={(e) => handleUpdateFormData(e)} />
                </div>
            </section>
            <div className={`gap-6 justify-end flex mt-8 transition-all duration-500 ease-in-out ${(formData?.nickname === profile?.nickname) && (formData.avatar_url === profile.avatar_url) ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'} font-bold`}>
                <button onClick={handleCancleForm} className="bg-foreground px-3 py-1 rounded-xl">{dict.ui.cancel}</button>
                <button onClick={sendForm} className={`px-4 py-1 bg-blue-600 border-4 border-blue-500 text-white rounded-xl`}>{dict.ui.save}</button>
            </div>
            <section className="mt-28" >
                <button className="flex gap-4 items-center" onClick={() => setShowDangerZone(prev => !prev)}>
                    <h2 className="font-semibold text-rose-500">{dict.setting.danger}</h2>
                    <ArrowCircleRightIcon weight="fill" size={24} className={`icon text-rose-500 ${showDangerZone ? 'rotate-90' : 'rotate-0'}`} />
                </button>
                {showDangerZone && <div className="flex flex-col gap-6 mt-8">
                    <DangerButton handleClick={handleDeleteAccount} content={dict.setting.delete.button} isRed={true} />
                    <DangerButton handleClick={handleClearRecords} content={dict.setting.clear.button} isRed={true} />
                    <DangerButton handleClick={handleLogout} content={dict.setting.logout} isRed={false} />
                </div>}
            </section>
            {modal}
            <input type="file" name="avatar" id="avatar" ref={fileInputRef} onChange={refreshPreviewAfterUpload} accept="image/*" style={{ display: 'none' }} />
        </div>
    );
};

export default SettingPage;
