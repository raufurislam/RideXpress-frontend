import PersonalInformation from "@/components/modules/Profile/PersonalInformation";

export default function Profile() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      <PersonalInformation />
    </div>
  );
}
