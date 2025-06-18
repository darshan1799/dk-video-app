import * as Yup from "yup";

const userSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const videoSchema = Yup.object({
  title: Yup.string().min(3).max(30).required("Title is required"),
  description: Yup.string()
    .min(6, "Description must be at least 6 characters")
    .max(80)
    .required("Description is required"),
});

export default userSchema;
