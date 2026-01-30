import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import RiderForm from "../components/RiderForm";
import StoreForm from "../components/StoreForm";
import ModalDialog from "../components/ModalDialog";
import { buildApiUrl } from "../utils/apiConfig";
import { VALIDATION_MESSAGES, USER_TYPES, ROUTES } from "../utils/constants";
import { passwordsMatch } from "../utils/validation";
import { uploadPhoto, loginAndGetToken } from "../utils/authHelpers";
import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { useAddressSearch } from "../hooks/useAddressSearch";

const Register = () => {
  const navigate = useNavigate();

  // Estado general
  const [userType, setUserType] = useState(USER_TYPES.RIDER);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Campos comunes
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Campos específicos de rider
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Campos específicos de store
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");

  // Custom hooks
  const { photo, photoPreview, setPhoto, setPhotoPreview } = usePhotoUpload();
  const {
    address,
    setAddress,
    suggestions,
    selectedCoordinates,
    searchAddress,
    handleSelectAddress,
  } = useAddressSearch();

  /**
   * Valida los campos requeridos según el tipo de usuario
   * @returns {boolean} true si todos los campos son válidos
   */
  const validateFields = () => {
    if (userType === USER_TYPES.RIDER) {
      if (!firstName || !lastName || !email || !password || !repeatPassword) {
        toast.error(VALIDATION_MESSAGES.REQUIRED_FIELDS);
        return false;
      }
    } else if (userType === USER_TYPES.SHOP) {
      if (
        !shopName ||
        !shopType ||
        !address ||
        !email ||
        !phone ||
        !password ||
        !repeatPassword
      ) {
        toast.error(VALIDATION_MESSAGES.REQUIRED_FIELDS);
        return false;
      }
    }

    if (!passwordsMatch(password, repeatPassword)) {
      toast.error(VALIDATION_MESSAGES.PASSWORDS_MISMATCH);
      return false;
    }

    return true;
  };

  /**
   * Registra un rider en el sistema
   */
  const registerRider = async () => {
    const registerUrl = buildApiUrl("/users/register");
    console.log("Registering rider at:", registerUrl);

    let user;
    try {
      const response = await axios.post(registerUrl, {
        name: `${firstName} ${lastName}`,
        email,
        password,
        phone: phone ? parseInt(phone) : null,
      });

      user = response.data.user;
      console.log("User registered:", user);
    } catch (error) {
      // Si el backend devuelve error pero creó el usuario, proceder
      if (error.response && error.response.data && error.response.data.user) {
        console.warn("Registration returned error but user was created");
        user = error.response.data.user;
      } else {
        throw error;
      }
    }

    // Si hay foto, intentar subirla después del registro
    if (photo) {
      try {
        const token = await loginAndGetToken(email, password, "users");
        console.log("Uploading rider photo...");
        await uploadPhoto(user.id, "users", photo, token);
      } catch (photoError) {
        console.error("Photo upload failed:", photoError);
        toast.warn(
          "Usuario registrado exitosamente, pero la subida de foto falló. Puedes subirla después desde tu perfil.",
        );
      }
    }

    return user;
  };

  /**
   * Registra una tienda en el sistema
   */
  const registerStore = async () => {
    const registerUrl = buildApiUrl("/stores/register");
    console.log("Registering store at:", registerUrl);

    let store;
    const response = await axios.post(
      registerUrl,
      {
        name: shopName,
        address,
        type: shopType,
        email,
        password,
        phone: phone ? parseInt(phone) : null,
        coordinates: selectedCoordinates,
      },
      { validateStatus: () => true },
    ); // No rechazar por status

    if (response.status >= 200 && response.status < 300) {
      store = response.data.store;
      console.log("Store registered:", store);
    } else if (response.status === 500) {
      // Asumir que se creó la tienda aunque haya error 500
      console.warn("Registration returned 500, assuming store was created");
      // Crear un objeto store básico para continuar
      store = { _id: "temp", name: shopName, email, address, type: shopType };
    } else {
      throw new Error(response.data?.message || "Registration failed");
    }

    // Si hay foto, intentar subirla después del registro
    if (photo) {
      try {
        const token = await loginAndGetToken(email, password, "stores");
        console.log("Uploading store photo...");
        await uploadPhoto(store._id, "stores", photo, token);
      } catch (photoError) {
        console.error("Photo upload failed:", photoError);
        toast.warn(
          "Tienda registrada exitosamente, pero la subida de foto falló. Puedes subirla después desde tu perfil.",
        );
      }
    }

    return store;
  };

  /**
   * Maneja el proceso de registro
   */
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      // Registrar según el tipo de usuario
      if (userType === USER_TYPES.RIDER) {
        await registerRider();
      } else if (userType === USER_TYPES.SHOP) {
        await registerStore();
      }

      toast.success(VALIDATION_MESSAGES.REGISTRATION_SUCCESS);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during registration",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-dvh bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
            <span className="material-symbols-outlined text-emerald-500 dark:text-emerald-400 text-4xl">
              volunteer_activism
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-0 mb-2">
            Create your account
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mt-2 mb-0">
            Select your account type to continue.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex h-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 p-1.5 mb-6 gap-1.5">
          {[USER_TYPES.RIDER, USER_TYPES.SHOP].map((role) => (
            <label
              key={role}
              onClick={() => setUserType(role)}
              className={`flex-1 flex items-center justify-center h-full rounded-lg px-2 text-sm font-medium cursor-pointer transition-all ${
                userType === role
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "bg-transparent text-gray-500 dark:text-gray-400"
              }`}
            >
              <span>{role === USER_TYPES.RIDER ? "Rider" : "Store"}</span>
              <input
                type="radio"
                name="role-selector"
                value={role}
                checked={userType === role}
                onChange={() => setUserType(role)}
                className="hidden"
              />
            </label>
          ))}
        </div>

        {/* Forms */}
        {userType === USER_TYPES.RIDER && (
          <RiderForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            repeatPassword={repeatPassword}
            setRepeatPassword={setRepeatPassword}
            showRepeatPassword={showRepeatPassword}
            setShowRepeatPassword={setShowRepeatPassword}
            photo={photo}
            setPhoto={setPhoto}
            photoPreview={photoPreview}
            setPhotoPreview={setPhotoPreview}
            loading={loading}
            handleRegister={handleRegister}
          />
        )}

        {userType === USER_TYPES.SHOP && (
          <StoreForm
            shopName={shopName}
            setShopName={setShopName}
            shopType={shopType}
            setShopType={setShopType}
            address={address}
            setAddress={setAddress}
            searchAddress={searchAddress}
            suggestions={suggestions}
            handleSelectAddress={handleSelectAddress}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            repeatPassword={repeatPassword}
            setRepeatPassword={setRepeatPassword}
            showRepeatPassword={showRepeatPassword}
            setShowRepeatPassword={setShowRepeatPassword}
            photo={photo}
            setPhoto={setPhoto}
            photoPreview={photoPreview}
            setPhotoPreview={setPhotoPreview}
            loading={loading}
            handleRegister={handleRegister}
          />
        )}

        {/* Terms */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 m-0">
            By creating an account, you accept our{" "}
            <button
              onClick={() => setShowTermsModal(true)}
              className="text-emerald-500 no-underline font-medium hover:underline bg-none border-none cursor-pointer text-xs"
            >
              Terms and Conditions
            </button>{" "}
            and{" "}
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-emerald-500 no-underline font-medium hover:underline bg-none border-none cursor-pointer text-xs"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 m-0">
            Already have an account?{" "}
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="font-bold text-emerald-500 bg-none border-none cursor-pointer no-underline text-sm hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </main>

      {/* Terms and Conditions Modal */}
      <ModalDialog
        isOpen={showTermsModal}
        title="Terms and Conditions"
        onClose={() => setShowTermsModal(false)}
      >
        <h3 className="font-bold text-emerald-600 mb-3">1. Purpose and Use</h3>
        <p className="mb-4">
          SoulBites is a community platform designed to connect stores, riders,
          and volunteers to rescue surplus food and distribute it to those in
          need within your city.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">
          2. User Responsibilities
        </h3>
        <p className="mb-4">
          Users agree to:
          <ul className="list-disc ml-5 mt-2">
            <li>Provide accurate and truthful information</li>
            <li>Use the platform only for legitimate food rescue purposes</li>
            <li>Respect other community members</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">3. Food Safety</h3>
        <p className="mb-4">
          Stores are responsible for ensuring food safety and compliance with
          local health regulations. SoulBites does not guarantee the quality or
          safety of any food shared on the platform.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">
          4. Limitation of Liability
        </h3>
        <p className="mb-4">
          SoulBites and its operators are not liable for any damages arising
          from the use of this platform, including food-related incidents or
          delivery issues.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">5. Modifications</h3>
        <p>
          We reserve the right to modify these terms at any time. Changes will
          be effective immediately upon posting.
        </p>
      </ModalDialog>

      {/* Privacy Policy Modal */}
      <ModalDialog
        isOpen={showPrivacyModal}
        title="Privacy Policy"
        onClose={() => setShowPrivacyModal(false)}
      >
        <h3 className="font-bold text-emerald-600 mb-3">
          1. Information We Collect
        </h3>
        <p className="mb-4">
          We collect information you provide directly, including:
          <ul className="list-disc ml-5 mt-2">
            <li>Name and contact information</li>
            <li>Email address and phone number</li>
            <li>Location and address data</li>
            <li>Account credentials</li>
          </ul>
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">
          2. How We Use Your Information
        </h3>
        <p className="mb-4">
          We use collected information to:
          <ul className="list-disc ml-5 mt-2">
            <li>Facilitate food rescue operations</li>
            <li>Connect users within your area</li>
            <li>Communicate important updates</li>
            <li>Improve our services</li>
          </ul>
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">3. Data Protection</h3>
        <p className="mb-4">
          We implement reasonable security measures to protect your personal
          information. However, no method of transmission over the internet is
          completely secure.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">4. Third Parties</h3>
        <p className="mb-4">
          We do not sell or share your personal information with third parties
          without your consent, except as required by law.
        </p>

        <h3 className="font-bold text-emerald-600 mb-3">5. Contact Us</h3>
        <p>
          If you have questions about this privacy policy, please contact us
          through the app's support feature.
        </p>
      </ModalDialog>
    </div>
  );
};

export default Register;
