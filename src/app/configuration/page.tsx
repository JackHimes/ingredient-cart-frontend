// "use client";

// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
//   Image,
// } from "@nextui-org/react";
// import { useEffect, useState } from "react";
// import Navbar from "../components/common/Navigation.tsx";
// import axios from "axios";
// import jwt from "jsonwebtoken"
// import * as dotenv from "dotenv";
// import { fetchAccessToken, refreshAccessToken } from '../api/krogerAuth.tsx'
// import { KrogerAccessJwt } from "../types/KrogerAccessJwt.tsx";
// import Footer from "../components/common/Footer.tsx";

// dotenv.config();

// export default function Page() {
//   const [selectedItem, setSelectedItem] = useState<string | null>(null);

//   useEffect(() => {
//     // Function to extract query parameters from the URL
//     const getQueryParam = (name: string) => {
//       const urlParams = new URLSearchParams(window.location.search);
//       return urlParams.get(name);
//     };

//     const checkAndRefreshToken = async () => {
//       const storeTokenObjectString = localStorage.getItem("customer_access_token");
//       if (storeTokenObjectString) {
//         const storeToken = JSON.parse(storeTokenObjectString);
//         const decodedToken = jwt.decode(storeToken.access_token) as KrogerAccessJwt;
//         if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
//           console.log("TOKEN HAS BEEN REFRESHED");
//           try {
//             const refreshedToken = await refreshAccessToken(
//               storeToken.refresh_token,
//               process.env.NEXT_PUBLIC_KROGER_REDIRECT_URI as string
//             );
//             const responseDataString = JSON.stringify(refreshedToken);
//             localStorage.setItem("customer_access_token", responseDataString);
//           } catch (error) {
//             console.error("Error refreshing token:", error);
//           }
//         } else {
//           console.log("TOKEN IS BUENO");
//         }
//       } else {
//         console.log("NO TOKEN, GETTING A NEW ONE");
//         const authorizationCode = getQueryParam("code");
//         if (authorizationCode) {
//           try {
//             const tokenData = await fetchAccessToken(
//               authorizationCode,
//               process.env.NEXT_PUBLIC_KROGER_REDIRECT_URI as string
//             );
//             const responseDataString = JSON.stringify(tokenData);
//             localStorage.setItem("customer_access_token", responseDataString);
//           } catch (error) {
//             console.error("Error fetching token:", error);
//           }
//         }
//       }
//     };

//     checkAndRefreshToken();
//   }, []);

//   const handleItemClick = (item: string) => {
//     setSelectedItem(item);
//   };

//   const openKrogerAuth = async (): Promise<any> => {
//     try {
//       const SCOPES = "profile.compact cart.basic:write product.compact";
//       const CLIENT_ID =
//         "ingredientcart-61754b7bda0bee174de5ec7c46e5351c6969468600073263900";

//       // Construct the URL
//       const authUrl = `https://api.kroger.com/v1/connect/oauth2/authorize?scope=${SCOPES}&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KROGER_REDIRECT_URI}`;

//       window.location.href = authUrl;
//     } catch (error: any) {
//       // Handle errors
//       console.error("Error in Kroger authentication:", error.message);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-off-white">
//       <Navbar />
//       <div className="flex-1 min-h-[600px] flex">
//         <div className="w-1/4 p-4">
//           <Table 
//           shadow="none"
//           classNames={{
//             base: "bg-transparent border border-border-green",
//             table: "bg-transparent",
//             th: "bg-transparent font-medium text-green-text text-lg",
//             td: "font-thin text-green-text",
//             wrapper: "bg-transparent",
//           }}>
//             <TableHeader>
//               <TableColumn>CONFIGURATIONS</TableColumn>
//             </TableHeader>
//             <TableBody>
//               <TableRow
//                 onClick={() => handleItemClick("Grocery Stores")}
//               >
//                 <TableCell>Grocery Stores</TableCell>
//               </TableRow>
//               <TableRow
//                 onClick={() => handleItemClick("Locations")}
//               >
//                 <TableCell>Locations</TableCell>
//               </TableRow>
//               <TableRow
//                 onClick={() => handleItemClick("Account")}
//               >
//                 <TableCell>Account</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </div>
//         <div className="w-3/4 p-4">
//           {selectedItem === "Grocery Stores" && (
//             <div className="border border-border-green text-green-text font-medium text-lg p-4">
//               <div>
//                 <p>Add a store:</p>
//                 <Button className="my-6" onClick={openKrogerAuth}>
//                   <Image
//                     className="object-cover"
//                     height={200}
//                     src="https://developer.kroger.com/assets/logos/integrated-blue-text.svg"
//                     width={200}
//                   />
//                 </Button>
//               </div>
//             </div>
//           )}
//           {selectedItem === "Locations" && (
//             <div className="bg-slate-50 rounded-lg text-slate-800">FOCO</div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }
