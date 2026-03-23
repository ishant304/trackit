import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {

        if (location.state?.fromLogin) {
            setIsAuth(true);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 5000);

        const checkAuth = async () => {
            try {
                const res = await fetch(
                    "https://trackit-xisc.onrender.com/api/user/profile",
                    {
                        credentials: "include",
                        signal: controller.signal,
                    }
                );

                if (res.ok) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                    navigate("/", { replace: true });
                }
            } catch (err) {
                console.log("Auth check failed:", err);
                setIsAuth(false);
                navigate("/", { replace: true });
            } finally {
                clearTimeout(timeout);
                setLoading(false);
            }
        };

        checkAuth();

        return () => {
            controller.abort();
            clearTimeout(timeout);
        };
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">

                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-gray-600 font-medium">
                        Checking authentication...
                    </p>

                </div>
            </div>
        );
    }

    if (!isAuth) return null;

    return children;
};

export default ProtectedRoute;