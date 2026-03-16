interface BadgeProps {
  text: string;
  variant?: "primary" | "success" | "destructive" | "warning" | "muted";
}

const variants = {
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  muted: "bg-muted text-muted-foreground border-border",
};

export default function Badge({ text, variant = "muted" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${variants[variant]}`}>
      {text}
    </span>
  );
}
