import AuthProvider from './auth-provider';
import QueryProvider from './query-provider';
import { ThemeProvider } from './theme-providers';
import ToastProvider from './toast-provider';

const AppProviders = ({ children }) => {
    return (
        <ThemeProvider>
            <QueryProvider>
                <AuthProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </AuthProvider>
            </QueryProvider>
        </ThemeProvider>
    );
};

export default AppProviders;
