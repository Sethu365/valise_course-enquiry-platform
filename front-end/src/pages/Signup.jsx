// src/pages/Signup.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { signupSchema } from '../utils/validators';
import { setPageTitle } from '../utils/helpers';
import PageTransition from '../components/layout/PageTransition';
import styles from './Login.module.css';

import { signupUser, setAuthData } from "../services/auth"; // ✅ real backend API

export default function Signup() {
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  useEffect(() => setPageTitle('Sign Up'), []);

  // Autofill sync for browser autofill
  useEffect(() => {
    const sync = () => {
      const name = document.querySelector('input[name="name"]');
      const email = document.querySelector('input[name="email"]');
      const pwd = document.querySelector('input[name="password"]');
      const confirm = document.querySelector('input[name="confirmPassword"]');

      if (name?.value) setValue('name', name.value);
      if (email?.value) setValue('email', email.value);
      if (pwd?.value) setValue('password', pwd.value);
      if (confirm?.value) setValue('confirmPassword', confirm.value);
    };

    sync();
    const t = setTimeout(sync, 300);
    return () => clearTimeout(t);
  }, [setValue]);

  // ✅ Updated submit function
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await signupUser(data.name, data.email, data.password);

      if (response.error) {
        error(response.error);
        return;
      }

      // Save token + user
      setAuthData(response.token, response.user);

      success("Account created successfully!");

      // Redirect user dashboard (Admin is manually added in DB)
      navigate("/user/dashboard", { replace: true });

    } catch (err) {
      error("Signup failed. Try again.");
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
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          role="main"
          aria-labelledby="signup-title"
        >
          <header className={styles.header}>
            <div className={styles.logoCircle} aria-hidden>
              <UserPlus size={28} />
            </div>
            <h1 id="signup-title" className={styles.title}>Create an account</h1>
            <p className={styles.subtitle}>Start your learning journey with Coursify</p>
          </header>

          {/* ✅ FIXED: handleSubmit + register correctly applied */}
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>

            {/* Full name */}
            <div className={styles.field}>
              <div className={styles.fieldInner}>
                <span className={styles.leftIcon}><User size={14} /></span>
                <input
                  id="name"
                  placeholder=" "
                  autoComplete="name"
                  {...register('name', { required: true })}
                  className={`${styles.input} ${errors.name ? styles.err : ''}`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                <label htmlFor="name" className={styles.flabel}>Full name</label>
              </div>
              {errors.name && <div className={styles.error}>{errors.name.message}</div>}
            </div>

            {/* Email */}
            <div className={styles.field}>
              <div className={styles.fieldInner}>
                <span className={styles.leftIcon}><Mail size={14} /></span>
                <input
                  id="email"
                  placeholder=" "
                  autoComplete="email"
                  {...register('email', { required: true })}
                  className={`${styles.input} ${errors.email ? styles.err : ''}`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                <label htmlFor="email" className={styles.flabel}>Email address</label>
              </div>
              {errors.email && <div className={styles.error}>{errors.email.message}</div>}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <div className={styles.fieldInner}>
                <span className={styles.leftIcon}><Lock size={14} /></span>
                <input
                  id="password"
                  placeholder=" "
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...register('password', { required: true })}
                  className={`${styles.input} ${errors.password ? styles.err : ''}`}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <label htmlFor="password" className={styles.flabel}>Password</label>

                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div className={styles.error}>{errors.password.message}</div>}
            </div>

            {/* Confirm Password */}
            <div className={styles.field}>
              <div className={styles.fieldInner}>
                <span className={styles.leftIcon}><Lock size={14} /></span>
                <input
                  id="confirmPassword"
                  placeholder=" "
                  type={showPassword ? "text" : "password"}
                  {...register('confirmPassword', { required: true })}
                  className={`${styles.input} ${errors.confirmPassword ? styles.err : ''}`}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                <label htmlFor="confirmPassword" className={styles.flabel}>Confirm password</label>
              </div>
              {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword.message}</div>}
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.primary} disabled={isLoading}>
                {isLoading ? "Creating…" : "Create account"}
              </button>
            </div>
          </form>

          <div className={styles.lower}>
            <div className={styles.orRow}>
              <span className={styles.line} />
              <span className={styles.orText}>or</span>
              <span className={styles.line} />
            </div>
            <p className={styles.signup}>
              Already have an account?
              <Link to="/login" className={styles.link}>Sign in</Link>
            </p>
          </div>
        </motion.main>
      </div>
    </PageTransition>
  );
}
