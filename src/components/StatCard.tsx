interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "primary" | "success" | "destructive" | "muted";
}

const colorMap = {
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  muted: "bg-muted text-muted-foreground border-border",
};

export default function StatCard({ label, value, icon, color = "primary" }: StatCardProps) {
  return (
    <div className="glass rounded-card p-5 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading font-bold text-2xl mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-btn flex items-center justify-center border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
