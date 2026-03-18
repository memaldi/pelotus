import { LeagueControlCenter } from "@/components/admin/LeagueControlCenter";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <section className="space-y-6">
      <Card className="border-primary/20 bg-linear-to-r from-primary/10 via-card to-accent/40">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>
              League-first control center for seasons, squads, fixtures, and outcomes.
            </CardDescription>
          </div>
          <Badge className="bg-primary text-primary-foreground">Live Control</Badge>
        </CardHeader>
      </Card>

      <LeagueControlCenter />
    </section>
  );
}
