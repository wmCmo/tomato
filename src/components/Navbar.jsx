const Navbar = () => {
    return (
        <nav className="bg-red-300 rounded-lg p-6">
            <a href="https://exzachly.notion.site" target="_blank" rel="noreferrer">
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-white text-center">Zach&apos;s Tomato🍅</h1>
                    <p className="text-center text-red-400 bg-red-100 px-4 py-1 mt-2 rounded-lg flex-shrink">New minimal Pomodoro timer</p>
                </div>
            </a>
        </nav>
    )
}

export default Navbar;
