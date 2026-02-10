import { Box, Typography, Divider } from "@mui/material";

const genderLabel = (g) => (g === "M" ? "Masculino" : g === "F" ? "Femenino" : g || "—");

const Section = ({ title, children }) => (
  <Box sx={{ mb: 2, pageBreakInside: "avoid" }}>
    <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ borderBottom: "1px solid", borderColor: "primary.main", pb: 0.5, mb: 1 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const hasValue = (v) => v != null && v !== "";

export default function TemplateResumida({ data, pathImg }) {
  if (!data) return null;
  const { user, userData, professional, professionalExperience, academicTraining } = data;
  const fullName = user ? [user.firstName, user.secondName, user.firstLastName, user.secondLastName].filter(Boolean).join(" ") : "";
  const cvPhotoUrl = (professional?.photo ? `${pathImg}${professional.photo}` : null) || (user?.photo ? `${pathImg}${user.photo}` : null);

  const hasContactLine = hasValue(professional?.personalEmail || userData?.personalEmail) || hasValue(professional?.institutionalEmail || userData?.institutionalEmail);
  const hasPhone = hasValue(userData?.cellPhone || userData?.phone);
  const hasPersonalData = hasValue(user?.ci) || hasValue(user?.gender) || hasValue(user?.birthday) || hasValue(userData?.bloodType) || hasValue(userData?.direction);

  return (
    <Box id="cv-print-area" sx={{ maxWidth: 210 * 3.78, mx: "auto", p: 2, bgcolor: "#fff", color: "#333" }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
        {cvPhotoUrl && (
          <Box component="img" src={cvPhotoUrl} alt="Foto CV" sx={{ width: 90, height: 110, objectFit: "cover", borderRadius: 1 }} />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">{fullName}</Typography>
          {professional?.professionalTitle && <Typography variant="body1" color="text.secondary">{professional.professionalTitle}</Typography>}
          {professional?.academicLevel && <Typography variant="body2">{professional.academicLevel}</Typography>}
          {hasContactLine && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {[professional?.personalEmail || userData?.personalEmail, professional?.institutionalEmail || userData?.institutionalEmail].filter(Boolean).join(" · ")}
            </Typography>
          )}
          {hasPhone && <Typography variant="body2">{userData?.cellPhone || userData?.phone}</Typography>}
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Esta plantilla solo muestra Datos personales si hay al menos un dato */}
      {hasPersonalData && (
        <Section title="Datos personales">
          <Typography variant="body2">Cédula: {user?.ci || "—"} · Género: {genderLabel(user?.gender)} · Nacimiento: {user?.birthday || "—"} · Tipo de sangre: {userData?.bloodType || "—"}</Typography>
          {userData?.direction && <Typography variant="body2">Dirección: {userData.direction}</Typography>}
        </Section>
      )}

      {professional?.summary && (
        <Section title="Resumen">
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{professional.summary}</Typography>
        </Section>
      )}

      {academicTraining?.length > 0 && (
        <Section title="Formación académica">
          {academicTraining.map((item) => (
            <Typography key={item.id} variant="body2" sx={{ mb: 0.5 }}>{item.obtainedTitle || item.educationalInstitution} {item.date && ` · ${item.date}`}</Typography>
          ))}
        </Section>
      )}

      {professionalExperience?.length > 0 && (
        <Section title="Experiencia profesional">
          {professionalExperience.map((item) => (
            <Box key={item.id} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">{item.companyInstitution} – {item.position}</Typography>
              <Typography variant="body2" color="text.secondary">{item.startDate} – {item.endDate || "Actualidad"}</Typography>
            </Box>
          ))}
        </Section>
      )}
    </Box>
  );
}
