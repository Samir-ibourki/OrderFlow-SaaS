import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Switch } from "@/components/ui/switch.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { useAuth } from "@/hooks/useAuth.js";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-6 border-b shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your store preferences.
        </p>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Profile</CardTitle>
              <CardDescription>
                Basic information about your business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={user?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={user?.email || ""} />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input defaultValue="MAD (د.م.)" disabled />
                <p className="text-xs text-muted-foreground">
                  Contact support to change currency.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Order Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Push notification for new orders.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Email me a daily summary of sales.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when a product drops below 5 items.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={() =>
                toast({
                  title: "Settings saved",
                  description: "Your preferences have been updated.",
                })
              }
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
