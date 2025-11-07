// src/pages/Login.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react";

import { loginSchema } from "../utils/validators";
import { loginUser } from "../services/auth"; // ✅ REAL API CALL

import { useAuth } from "../context/AuthContext"; // ✅ UPDATE AUTH CONTEXT
import { useToast } from "../hooks/useToast";
import { setPageTitle } from "../utils/helpers";
import PageTransition from "../components/layout/PageTransition";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error } = useToast();
  const { login } = useAuth(); // ✅ Context login function

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pwdRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => setPageTitle("Login"), []);

  // ✅ Autofill support (Chrome fix)
  useEffect(() => {
    const syncAutofill = () => {
      const email = document.querySelector('input[name="email"]');
      const password = document.querySelector('input[name="password"]');
      if (email?.value) setValue("email", email.value);
      if (password?.value) setValue("password", password.value);
    };
    syncAutofill();
    const t = setTimeout(syncAutofill, 300);
    return () => clearTimeout(t);
  }, [setValue]);

  // ✅ REAL LOGIN SUBMISSION
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data.email, data.password);
      console.log("LOGIN RESPONSE:", response); // debug

      if (response.error) {
        error(response.error);
        return;
      }

      // ✅ Update AuthContext + localStorage
      login(response.user, response.token);

      success("Login successful!");

      // ✅ Redirect to HOME PAGE
      navigate("/", { replace: true });
    } catch (err) {
      error("Invalid credentials. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className={styles.page}>
        <div className={styles.backdrop} aria-hidden />

        <motion.main
          className={styles.cardWrap}
          initial={{ opacity: 0, y: 12, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          role="main"
          aria-labelledby="login-title"
        >
          <header className={styles.header}>
            <div className={styles.logoCircle} aria-hidden>
              <LogIn size={28} />
            </div>
            <h1 id="login-title" className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>
              Sign in to continue your learning journey
            </p>
          </header>

          {/* ✅ Form START */}
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>

            {/* Email */}
            <div className={styles.field}>
              <div className={styles.fieldInner}>
                <span className={styles.leftIcon}><Mail size={14} /></span>
                <input
                  type="email"
                  placeholder=" "
                  autoComplete="email"
                  {...register("email")}
                  className={`${styles.input} ${errors.email ? styles.err : ""}`}
                />
                <label className={styles.flabel}>Email address</label>
              </div>
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <div className={styles.fieldInner}>
                <span className={styles.leftIcon}><Lock size={14} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  autoComplete="current-password"
                  {...register("password")}
                  ref={pwdRef}
                  className={`${styles.input} ${errors.password ? styles.err : ""}`}
                />
                <label className={styles.flabel}>Password</label>

                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => {
                    setShowPassword(!showPassword);
                    pwdRef.current?.focus();
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.primary} disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
          {/* ✅ Form END */}

          <div className={styles.lower}>
            <div className={styles.orRow}>
              <span className={styles.line} /><span className={styles.orText}>or</span><span className={styles.line} />
            </div>
            <p className={styles.signup}>
              Don’t have an account? <Link to="/signup" className={styles.link}>Sign up</Link>
            </p>
          </div>
        </motion.main>
      </div>
    </PageTransition>
  );
}
