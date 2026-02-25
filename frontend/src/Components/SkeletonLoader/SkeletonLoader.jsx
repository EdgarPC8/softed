import React from "react";
import { Box, Card, CardContent, Grid, Paper, Skeleton } from "@mui/material";

/**
 * Esqueleto de carga reutilizable - muestra placeholders mientras cargan los componentes
 * variants: "cardGrid" | "cardList" | "form" | "detail" | "list"
 */
export default function SkeletonLoader({ variant = "cardGrid", count = 6 }) {
  if (variant === "cardGrid") {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 1 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </Box>
                </Box>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Skeleton variant="rounded" width={80} height={24} />
                  <Skeleton variant="rounded" width={100} height={24} />
                </Box>
              </CardContent>
              <Box sx={{ px: 2, pb: 2 }}>
                <Skeleton variant="rounded" width={100} height={36} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (variant === "cardList") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
              <Skeleton variant="rounded" width={80} height={24} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (variant === "form") {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton variant="rectangular" height={56} sx={{ flex: 1, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ flex: 1, borderRadius: 1 }} />
          </Box>
          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rounded" width={120} height={40} />
        </Box>
      </Paper>
    );
  }

  if (variant === "detail") {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 1 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={36} />
            <Skeleton variant="text" width="50%" height={24} />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Skeleton variant="rounded" width={90} height={24} />
              <Skeleton variant="rounded" width={100} height={24} />
            </Box>
          </Box>
        </Box>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="95%" />
        <Skeleton variant="text" width="80%" />
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
        </Box>
      </Paper>
    );
  }

  if (variant === "list") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="50%" height={24} />
              <Skeleton variant="text" width="35%" height={18} />
            </Box>
            <Skeleton variant="rounded" width={70} height={24} />
            <Skeleton variant="rounded" width={80} height={36} />
          </Box>
        ))}
      </Box>
    );
  }

  return null;
}
