import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Key,
  Monitor,
  Shield,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const LOGIN_ACTIVITY = [
  {
    id: 1,
    time: "Mar 25, 2026 09:41",
    device: "Chrome / macOS",
    location: "San Francisco, US",
    status: "Success",
  },
  {
    id: 2,
    time: "Mar 24, 2026 22:17",
    device: "Safari / iPhone",
    location: "San Francisco, US",
    status: "Success",
  },
  {
    id: 3,
    time: "Mar 24, 2026 08:03",
    device: "Chrome / macOS",
    location: "San Francisco, US",
    status: "Success",
  },
  {
    id: 4,
    time: "Mar 23, 2026 14:55",
    device: "Firefox / Windows",
    location: "New York, US",
    status: "Blocked",
  },
  {
    id: 5,
    time: "Mar 22, 2026 11:20",
    device: "Chrome / Android",
    location: "Mumbai, IN",
    status: "Success",
  },
];

const SESSIONS = [
  {
    id: 1,
    device: "Chrome / macOS",
    location: "San Francisco, US",
    lastActive: "Now",
    current: true,
  },
  {
    id: 2,
    device: "Safari / iPhone",
    location: "San Francisco, US",
    lastActive: "2 hrs ago",
    current: false,
  },
  {
    id: 3,
    device: "Chrome / Android",
    location: "Mumbai, IN",
    lastActive: "1 day ago",
    current: false,
  },
];

const BACKUP_CODES = [
  "KAI-A1B2-C3D4",
  "KAI-E5F6-G7H8",
  "KAI-I9J0-K1L2",
  "KAI-M3N4-O5P6",
  "KAI-Q7R8-S9T0",
  "KAI-U1V2-W3X4",
];

export function SecurityPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [_verified, setVerified] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS);
  const { actor } = useActor();

  useEffect(() => {
    if (!actor) return;
    actor
      .is2FAEnabled()
      .then(setIs2FAEnabled)
      .catch(() => {});
  }, [actor]);

  const handle2FAToggle = async (enabled: boolean) => {
    if (enabled && !is2FAEnabled) {
      setShowSetup(true);
    } else if (!enabled) {
      setIs2FAEnabled(false);
      setVerified(false);
      setShowSetup(false);
      if (actor) actor.set2FAEnabled(false).catch(() => {});
      toast.success("2FA disabled");
    }
  };

  const handleVerify = () => {
    if (verifyCode.length === 6) {
      setIs2FAEnabled(true);
      setVerified(true);
      setShowSetup(false);
      if (actor) actor.set2FAEnabled(true).catch(() => {});
      toast.success("2FA enabled successfully!");
    } else {
      toast.error("Enter a 6-digit code");
    }
  };

  const securityScore = is2FAEnabled ? 95 : 60;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">
          Security Center
        </h1>
        <p className="text-muted-foreground">
          Manage your account security and active sessions
        </p>
      </motion.div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">
              Security Score
            </h2>
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            {securityScore}/100
          </span>
        </div>
        <Progress value={securityScore} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">
          {is2FAEnabled
            ? "Excellent! Your account is well-protected."
            : "Enable 2FA to boost your score to 95/100."}
        </p>
      </motion.div>

      {/* 2FA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-display font-semibold text-foreground">
                Two-Factor Authentication
              </h2>
              <p className="text-xs text-muted-foreground">
                TOTP — Google Authenticator, Authy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {is2FAEnabled && (
              <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            )}
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handle2FAToggle}
              data-ocid="security.switch"
            />
          </div>
        </div>

        {showSetup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border border-border rounded-xl p-5 space-y-5"
          >
            <div className="text-sm font-medium text-foreground">
              Scan QR Code with your authenticator app
            </div>

            {/* Mock QR code */}
            <div className="w-40 h-40 mx-auto bg-white rounded-lg p-2">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #000 0px, #000 4px, transparent 4px, transparent 8px), repeating-linear-gradient(90deg, #000 0px, #000 4px, transparent 4px, transparent 8px)",
                  backgroundSize: "8px 8px",
                  opacity: 0.85,
                }}
              />
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Manual entry key:
              </p>
              <code className="text-xs font-mono bg-muted px-3 py-1 rounded text-primary">
                KAIX-2026-AGENT-7F3K
              </code>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Backup Codes (save these)</Label>
              <div className="grid grid-cols-3 gap-2">
                {BACKUP_CODES.map((code) => (
                  <code
                    key={code}
                    className="text-[10px] font-mono bg-muted px-2 py-1 rounded text-muted-foreground text-center"
                  >
                    {code}
                  </code>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Input
                value={verifyCode}
                onChange={(e) =>
                  setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                className="font-mono tracking-widest"
                maxLength={6}
                data-ocid="security.input"
              />
              <Button
                onClick={handleVerify}
                className="bg-primary hover:bg-primary/80 text-primary-foreground shrink-0"
                data-ocid="security.confirm_button"
              >
                Verify
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Login Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground">
            Login Activity
          </h2>
        </div>
        <Table data-ocid="loginactivity.table">
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground text-xs">
                Time
              </TableHead>
              <TableHead className="text-muted-foreground text-xs">
                Device
              </TableHead>
              <TableHead className="text-muted-foreground text-xs">
                Location
              </TableHead>
              <TableHead className="text-muted-foreground text-xs">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LOGIN_ACTIVITY.map((log, i) => (
              <TableRow
                key={log.id}
                className="border-border"
                data-ocid={`loginactivity.row.${i + 1}`}
              >
                <TableCell className="text-xs text-muted-foreground">
                  {log.time}
                </TableCell>
                <TableCell className="text-xs text-foreground">
                  {log.device}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {log.location}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      log.status === "Success"
                        ? "border-green-500/40 text-green-400"
                        : "border-red-500/40 text-red-400"
                    }`}
                  >
                    {log.status === "Blocked" && (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Session Management */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground">
            Active Sessions
          </h2>
        </div>
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border"
              data-ocid={`session.item.${i + 1}`}
            >
              <div className="flex items-center gap-3">
                {session.device.includes("iPhone") ||
                session.device.includes("Android") ? (
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {session.device}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.location} · {session.lastActive}
                  </div>
                </div>
              </div>
              {session.current ? (
                <Badge
                  variant="outline"
                  className="text-[10px] border-green-500/40 text-green-400"
                >
                  Current
                </Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive text-xs h-7"
                  onClick={() =>
                    setSessions((prev) =>
                      prev.filter((s) => s.id !== session.id),
                    )
                  }
                  data-ocid={`session.delete_button.${i + 1}`}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
