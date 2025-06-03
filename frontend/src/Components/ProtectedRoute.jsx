// import { Navigate, Outlet } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";
// import { Center, Spinner } from "@chakra-ui/react";
// import NoAccess from "./NoAccess";

// function ProtectedRoute({ requiredRol }) {
//   const { isAuthenticated, isLoading, user } = useAuth();

//   if (isLoading)
//     return (
//       <Center height="100vh">
//         <Spinner
//           thickness="4px"
//           speed="0.65s"
//           emptyColor="gray.200"
//           color="blue.500"
//           size="xl"
//         />
//       </Center>
//     );

//   if (isAuthenticated && !requiredRol.includes(user.loginRol)) {
//     return <NoAccess />;
//   }

//   if (!isAuthenticated && !isLoading) return <Navigate to="/login" replace />;
//   return <Outlet />;
// }

// export default ProtectedRoute;
