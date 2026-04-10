import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Redirige /ficha/anadir → /ficha/nuevo/1 (formulario con búsqueda) */
export default function AnadirFichaPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/ficha/nuevo/1", { replace: true });
  }, [navigate]);
  return null;
}
