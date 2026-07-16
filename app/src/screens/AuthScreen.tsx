import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native";
import { Mail, Lock, User, Phone, Eye, EyeOff, Gamepad2, Globe } from "lucide-react-native";
import { GamingButton } from "../components/shared/GamingButton";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";
import { showToast } from "../services/toast";

type IconType = React.ComponentType<{ size: number; color: string }>;

function InputField({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: IconType;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "rgba(26, 26, 46, 0.8)",
        borderWidth: 1,
        borderColor: "rgba(124, 58, 237, 0.2)",
      }}
    >
      <Icon size={18} color={colors.textMuted} />
      <TextInput
        style={{ flex: 1, color: colors.text, fontSize: 14, outlineWidth: 0 }}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={isPassword ? (show ? false : true) : false}
        keyboardType={type === "email" ? "email-address" : type === "tel" ? "phone-pad" : "default"}
        autoCapitalize="none"
        value={value}
        onChangeText={onChange}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShow(!show)}>
          {show ? <EyeOff size={16} color={colors.textMuted} /> : <Eye size={16} color={colors.textMuted} />}
        </TouchableOpacity>
      )}
    </View>
  );
}

function LoginForm({ onLogin }: { onLogin: (creds: { email: string; password: string }) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ gap: 12 }}>
      <InputField icon={Mail} placeholder="Email address" type="email" value={email} onChange={setEmail} />
      <InputField icon={Lock} placeholder="Password" type="password" value={password} onChange={setPassword} />
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 12, color: colors.purple }}>Forgot password?</Text>
      </View>
      <GamingButton variant="purple" size="lg" fullWidth onPress={() => onLogin({ email, password })}>
        Sign In
      </GamingButton>
    </View>
  );
}

function RegisterForm({ onRegister }: { onRegister: (data: { name: string; email: string; phone: string; password: string }) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ gap: 12 }}>
      <InputField icon={User} placeholder="Full name" value={name} onChange={setName} />
      <InputField icon={Mail} placeholder="Email address" type="email" value={email} onChange={setEmail} />
      <InputField icon={Phone} placeholder="Phone number" type="tel" value={phone} onChange={setPhone} />
      <InputField icon={Lock} placeholder="Password" type="password" value={password} onChange={setPassword} />
      <GamingButton variant="cyan" size="lg" fullWidth onPress={() => onRegister({ name, email, phone, password })}>
        Create Account
      </GamingButton>
    </View>
  );
}

export function AuthScreen() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { login, register } = useAuth();

  const handleLogin = async (creds: { email: string; password: string }) => {
    try {
      await login(creds.email, creds.password);
    } catch (e: any) {
      showToast({ type: "error", text1: "Ошибка входа", text2: e?.message ?? "Проверьте данные" });
    }
  };

  const handleRegister = async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      await register(data);
    } catch (e: any) {
      showToast({ type: "error", text1: "Ошибка регистрации", text2: e?.message ?? "Попробуйте снова" });
    }
  };

  const handleSocial = async () => {
    try {
      await login("guest@cofou.app", "guest1234");
    } catch {
      try {
        await register({ name: "Guest", email: "guest@cofou.app", password: "guest1234" });
      } catch (e: any) {
        showToast({ type: "error", text1: "Ошибка входа", text2: e?.message ?? "Попробуйте снова" });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ flex: 1, backgroundColor: colors.bgDeep }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
    >
      <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Background glow orbs */}
        <View style={{ position: "absolute", top: -80, left: -60, width: 280, height: 280, borderRadius: 140, backgroundColor: "rgba(124, 58, 237, 0.25)" }} />
        <View style={{ position: "absolute", top: "40%", right: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(6, 182, 212, 0.18)" }} />
        <View style={{ position: "absolute", bottom: -60, left: "20%", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(124, 58, 237, 0.15)" }} />

        {/* Hero */}
        <View style={{ alignItems: "center", paddingTop: 64, paddingBottom: 32, paddingHorizontal: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              backgroundColor: colors.purple,
              shadowColor: colors.purple,
              shadowOpacity: 0.5,
              shadowRadius: 20,
            }}
          >
            <Gamepad2 size={40} color="#FFFFFF" />
          </View>
          <Text style={{ color: colors.text, fontSize: 32, fontWeight: "700", letterSpacing: -0.5 }}>
            Cofou
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 4, textAlign: "center" }}>
            Reserve your ultimate gaming setup
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
            {["RTX 4090", "360Hz", "Pro Gear"].map((feat) => (
              <View
                key={feat}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: "rgba(124, 58, 237, 0.15)",
                  borderWidth: 1,
                  borderColor: "rgba(124, 58, 237, 0.3)",
                }}
              >
                <Text style={{ color: colors.purpleLight, fontSize: 12, fontWeight: "600" }}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Auth card */}
        <View
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginBottom: 16,
            borderRadius: 24,
            padding: 24,
            backgroundColor: "rgba(26, 26, 46, 0.9)",
            borderWidth: 1,
            borderColor: "rgba(124, 58, 237, 0.2)",
          }}
        >
          {/* Tabs */}
          <View
            style={{
              flexDirection: "row",
              borderRadius: 12,
              padding: 4,
              marginBottom: 24,
              backgroundColor: "rgba(15, 15, 15, 0.6)",
            }}
          >
            {(["login", "register"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor: activeTab === tab ? colors.purple : "transparent",
                  shadowColor: activeTab === tab ? colors.purple : undefined,
                  shadowOpacity: activeTab === tab ? 0.4 : 0,
                  shadowRadius: 6,
                }}
              >
                <Text style={{ color: activeTab === tab ? "#FFFFFF" : colors.textMuted, fontSize: 14, fontWeight: "600" }}>
                  {tab === "login" ? "Sign In" : "Register"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "login" ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <RegisterForm onRegister={handleRegister} />
          )}

          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
            <Text style={{ fontSize: 12, color: colors.textMuted }}>or continue with</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
          </View>

          {/* Social */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={handleSocial}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Globe size={18} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSocial}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Phone size={18} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600" }}>Phone</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ textAlign: "center", fontSize: 12, color: "#555570", paddingBottom: 24 }}>
          By continuing you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}
