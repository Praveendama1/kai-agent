import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  {
    id: "1",
    type: "card",
    label: "Visa",
    identifier: "•••• •••• •••• 4242",
    expiry: "12/26",
    primary: true,
  },
  {
    id: "2",
    type: "upi",
    label: "UPI",
    identifier: "user@paytm",
    expiry: null,
    primary: false,
  },
];

interface Props {
  onClose?: () => void;
}

export function PaymentMethodsPanel({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="w-80 bg-card border-l border-border h-full flex flex-col"
      data-ocid="payments.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <h2 className="font-display font-semibold text-foreground text-sm">
            Payment Methods
          </h2>
          <Badge
            variant="outline"
            className="text-[9px] border-primary/40 text-primary ml-1"
          >
            {PAYMENT_METHODS.length} linked
          </Badge>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="payments.close_button"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Methods list */}
      <div className="flex-1 px-5 py-4 space-y-3 overflow-y-auto">
        {PAYMENT_METHODS.map((method, i) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border"
            data-ocid={`payments.item.${i + 1}`}
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              {method.type === "card" ? (
                <CreditCard className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Smartphone className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground">
                  {method.label}
                </span>
                {method.primary && (
                  <Badge
                    variant="outline"
                    className="text-[8px] border-green-500/40 text-green-400 px-1 py-0"
                  >
                    Primary
                  </Badge>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {method.identifier}
                {method.expiry && (
                  <span className="ml-2 text-muted-foreground/60">
                    exp {method.expiry}
                  </span>
                )}
              </div>
            </div>
            {!method.primary && (
              <button
                type="button"
                onClick={() =>
                  toast.success("Method removed", {
                    description: method.identifier,
                  })
                }
                className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors shrink-0"
                data-ocid={`payments.delete_button.${i + 1}`}
              >
                Remove
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add button */}
      <div className="px-5 py-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full border-dashed border-primary/30 text-primary hover:bg-primary/10 text-xs h-9"
          onClick={() =>
            toast("Coming soon", {
              description: "Payment method management will be available soon.",
            })
          }
          data-ocid="payments.primary_button"
        >
          <CreditCard className="h-3.5 w-3.5 mr-2" /> + Add Payment Method
        </Button>
      </div>
    </motion.div>
  );
}
