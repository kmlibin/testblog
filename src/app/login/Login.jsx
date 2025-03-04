"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";

import styles from "./loginPage.module.css";

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
//   const { setUser, addAuthContext } = useAuth();

//   const handleSignIn = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         body: JSON.stringify({ email, password }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (res.status === 200) {
//         const userData = { isAdmin: true };
//         setUser && setUser(userData);
//         addAuthContext();
//         setLoading(false);
//         router.push("/admin");
//       } else {
//         setLoading(false);
//         setEmail("");
//         setPassword("");
//         setModalMessage(
//           "Login failed. Please check credentials and try again."
//         );
//         setShowModal(true);
//         console.log(res);
//       }
//     } catch (error) {
//       setLoading(false);
//       setModalMessage("Hmmm...something went wrong.");
//       setShowModal(true);
//       console.log(`error ${error}`);
//     }
//   };

//   //closes error modal
//   const closeModal = () => {
//     setShowModal(false);
//   };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button  className={styles.button}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Login;
