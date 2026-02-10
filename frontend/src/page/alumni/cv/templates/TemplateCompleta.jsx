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

const Row = ({ label, value }) =>
  value ? (
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      <strong>{label}:</strong> {value}
    </Typography>
  ) : null;

const hasValue = (v) => v != null && v !== "";

export default function TemplateCompleta({ data, pathImg }) {
  if (!data) return null;
  const { user, userData, professional, academicTraining, teachingExperience, coursesWorkshops, intellectualProduction, books, merits, languages, professionalExperience } = data;
  const fullName = user ? [user.firstName, user.secondName, user.firstLastName, user.secondLastName].filter(Boolean).join(" ") : "";
  const cvPhotoUrl = (professional?.photo ? `${pathImg}${professional.photo}` : null) || (user?.photo ? `${pathImg}${user.photo}` : null);

  const hasContactData = hasValue(professional?.personalEmail || userData?.personalEmail) || hasValue(professional?.institutionalEmail || userData?.institutionalEmail) || hasValue(userData?.phone) || hasValue(userData?.cellPhone) || hasValue(userData?.direction) || hasValue(userData?.placeResidence);
  const hasPersonalData = hasValue(user?.ci) || hasValue(user?.gender) || hasValue(user?.birthday) || hasValue(userData?.bloodType);

  return (
    <Box id="cv-print-area" sx={{ maxWidth: 210 * 3.78, mx: "auto", p: 2, bgcolor: "#fff", color: "#333" }}>
      {/* Encabezado: foto + nombre + título */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
        {cvPhotoUrl && (
          <Box component="img" src={cvPhotoUrl} alt="Foto CV" sx={{ width: 100, height: 120, objectFit: "cover", borderRadius: 1 }} />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">{fullName}</Typography>
          {professional?.professionalTitle && <Typography variant="body1" color="text.secondary">{professional.professionalTitle}</Typography>}
          {professional?.academicLevel && <Typography variant="body2">{professional.academicLevel}</Typography>}
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Datos de contacto: esta plantilla solo muestra la sección si hay al menos un dato */}
      {hasContactData && (
        <Section title="Datos de contacto">
          <Row label="Correo personal" value={professional?.personalEmail || userData?.personalEmail} />
          <Row label="Correo institucional" value={professional?.institutionalEmail || userData?.institutionalEmail} />
          <Row label="Teléfono" value={userData?.phone} />
          <Row label="Celular" value={userData?.cellPhone} />
          <Row label="Dirección" value={userData?.direction} />
          <Row label="Lugar de residencia" value={userData?.placeResidence} />
        </Section>
      )}

      {/* Datos personales: solo si hay al menos un dato */}
      {hasPersonalData && (
        <Section title="Datos personales">
          <Row label="Cédula" value={user?.ci} />
          <Row label="Género" value={genderLabel(user?.gender)} />
          <Row label="Fecha de nacimiento" value={user?.birthday} />
          <Row label="Tipo de sangre" value={userData?.bloodType} />
        </Section>
      )}

      {/* Resumen */}
      {professional?.summary && (
        <Section title="Resumen / Perfil profesional">
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{professional.summary}</Typography>
        </Section>
      )}

      {/* Formación académica */}
      {academicTraining?.length > 0 && (
        <Section title="Formación académica">
          {academicTraining.map((item, i) => (
            <Box key={item.id} sx={{ mb: 1.5 }}>
              <Typography variant="body2" fontWeight="medium">{item.obtainedTitle || item.educationalInstitution || "—"}</Typography>
              <Typography variant="body2" color="text.secondary">{item.educationalInstitution} {item.date && ` · ${item.date}`}</Typography>
            </Box>
          ))}
        </Section>
      )}

      {/* Experiencia docente */}
      {teachingExperience?.length > 0 && (
        <Section title="Experiencia docente">
          {teachingExperience.map((item) => (
            <Box key={item.id} sx={{ mb: 1.5 }}>
              <Typography variant="body2" fontWeight="medium">{item.educationalInstitution} – {item.subject}</Typography>
              <Typography variant="body2" color="text.secondary">{item.startDate} – {item.endDate || "Actualidad"}</Typography>
            </Box>
          ))}
        </Section>
      )}

      {/* Cursos y talleres */}
      {coursesWorkshops?.length > 0 && (
        <Section title="Cursos, talleres y seminarios">
          {coursesWorkshops.map((item) => (
            <Typography key={item.id} variant="body2" sx={{ mb: 0.5 }}>{item.name} {item.organizedBy && `(${item.organizedBy})`} {item.startDate && ` · ${item.startDate}`}</Typography>
          ))}
        </Section>
      )}

      {/* Producción intelectual */}
      {intellectualProduction?.length > 0 && (
        <Section title="Producción intelectual">
          {intellectualProduction.map((item) => (
            <Typography key={item.id} variant="body2" sx={{ mb: 0.5 }}>{item.name} {item.type && `(${item.type})`} {item.date && ` · ${item.date}`}</Typography>
          ))}
        </Section>
      )}

      {/* Libros */}
      {books?.length > 0 && (
        <Section title="Libros">
          {books.map((item) => (
            <Typography key={item.id} variant="body2" sx={{ mb: 0.5 }}>{item.title} {item.year && ` · ${item.year}`}</Typography>
          ))}
        </Section>
      )}

      {/* Méritos */}
      {merits?.length > 0 && (
        <Section title="Méritos académicos y profesionales">
          {merits.map((item) => (
            <Typography key={item.id} variant="body2" sx={{ mb: 0.5 }}>{item.name} {item.date && ` · ${item.date}`} {item.grantedBy && `(${item.grantedBy})`}</Typography>
          ))}
        </Section>
      )}

      {/* Idiomas */}
      {languages?.length > 0 && (
        <Section title="Idiomas">
          {languages.map((item) => (
            <Typography key={item.id} variant="body2" sx={{ mb: 0.5 }}>{item.name} {item.speakingLevel && ` · Nivel: ${item.speakingLevel}`}</Typography>
          ))}
        </Section>
      )}

      {/* Experiencia profesional */}
      {professionalExperience?.length > 0 && (
        <Section title="Experiencia profesional">
          {professionalExperience.map((item) => (
            <Box key={item.id} sx={{ mb: 1.5 }}>
              <Typography variant="body2" fontWeight="medium">{item.companyInstitution} – {item.position}</Typography>
              <Typography variant="body2" color="text.secondary">{item.startDate} – {item.endDate || "Actualidad"}</Typography>
            </Box>
          ))}
        </Section>
      )}
    </Box>
  );
}
