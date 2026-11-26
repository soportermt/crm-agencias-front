export const getStoredUser = () => {
    if (typeof window === "undefined") return null;
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
};

export const esAgenciaPrincipal = (user = getStoredUser()) =>
    String(user?.id_agencia) === "1";