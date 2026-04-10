import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, Loader2, Trash2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";

interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ElementType;
  features: string[];
}

const ROLES: RoleOption[] = [
  {
    role: UserRole.facilitiesStaff,
    label: "Facilities Staff",
    description: "Dispatch collections, track bin status, manage tasks",
    icon: Trash2,
    features: ["Live bin status", "Collection tasks", "7-day forecasts"],
  },
  {
    role: UserRole.campusManager,
    label: "Campus Manager",
    description: "Monitor trends, view summaries, analyse campus waste",
    icon: Building2,
    features: ["Building analytics", "Waste trends", "Performance reports"],
  },
];

export default function LoginPage() {
  const { authState, login, loginAs, loginStatus, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"connect" | "profile">("connect");
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    UserRole.facilitiesStaff,
  );
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  // If already authenticated with a profile, redirect
  useEffect(() => {
    if (authState.status === "authenticated") {
      const dest =
        authState.profile.role === UserRole.facilitiesStaff
          ? "/staff"
          : "/manager";
      navigate({ to: dest });
    }
  }, [authState, navigate]);

  // After successful login, move to profile step if no profile yet
  useEffect(() => {
    if (isLoggedIn && authState.status === "no-profile") {
      setStep("profile");
    }
  }, [isLoggedIn, authState.status]);

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await loginAs(name.trim(), selectedRole);
    } finally {
      setSaving(false);
    }
  };

  const isConnecting = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-background flex" data-ocid="login-page">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-card border-r border-border p-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-semibold text-foreground">
            SmartBin Campus
          </span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary text-[10px] uppercase tracking-widest"
            >
              Predictive Intelligence
            </Badge>
            <h2 className="font-display text-3xl font-bold text-foreground leading-tight">
              Waste management
              <br />
              before it overflows.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              AI-powered bin fill forecasting keeps your campus clean. Know
              which bins need collection before they reach capacity.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "10", label: "Buildings" },
              { value: "30", label: "Smart Bins" },
              { value: "95%", label: "Accuracy" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-muted/40 p-3 text-center border border-border"
              >
                <p className="font-display text-xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} SmartBin Campus — Secure via Internet
          Identity
        </p>
      </div>

      {/* Right panel — auth */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-2.5 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-semibold text-foreground">
              SmartBin Campus
            </span>
          </div>

          {step === "connect" && (
            <>
              <div className="space-y-1">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Sign in
                </h1>
                <p className="text-sm text-muted-foreground">
                  Connect with Internet Identity to access the platform.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={login}
                disabled={isConnecting}
                data-ocid="login-connect-btn"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  <>
                    Connect with Internet Identity
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Internet Identity provides secure, anonymous login — no email
                required.
              </p>
            </>
          )}

          {step === "profile" && (
            <>
              <div className="space-y-1">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Set up your profile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Choose your role to see the right view.
                </p>
              </div>

              <div className="space-y-4">
                {/* Name input */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Your name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Jordan Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-ocid="profile-name-input"
                  />
                </div>

                {/* Role selection */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Your role</Label>
                  <div className="grid gap-3">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const isSelected = selectedRole === r.role;
                      return (
                        <Card
                          key={r.role}
                          className={cn(
                            "cursor-pointer transition-smooth border-2",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40",
                          )}
                          onClick={() => setSelectedRole(r.role)}
                          data-ocid={`role-card-${r.role}`}
                        >
                          <CardContent className="flex items-start gap-3 p-4">
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-smooth",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <p className="font-display text-sm font-semibold text-foreground">
                                {r.label}
                              </p>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {r.description}
                              </p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {r.features.map((f) => (
                                  <Badge
                                    key={f}
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0"
                                  >
                                    {f}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSaveProfile}
                  disabled={!name.trim() || saving}
                  data-ocid="profile-save-btn"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      Enter platform
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
