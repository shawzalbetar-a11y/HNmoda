import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update your public contact details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input id="whatsapp" defaultValue="901234567890" />
            <p className="text-sm text-muted-foreground">
              This number will be used for the WhatsApp chat button.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Public Email</Label>
            <Input id="email" type="email" defaultValue="contact@hntextile.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Public Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="+90 212 555 1234" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>General website settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sitename">Site Name</Label>
            <Input id="sitename" defaultValue="HN TextileVerse" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
