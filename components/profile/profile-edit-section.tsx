import { Reveal } from "@/components/home/reveal";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";

export function ProfileEditSection({
  name,
  image,
}: {
  name: string;
  image: string | null;
}) {
  return (
    <Reveal>
      <section id="edit-profile" aria-labelledby="edit-profile-heading">
        <div className="mb-4">
          <h2
            id="edit-profile-heading"
            className="mt-1 text-2xl font-semibold tracking-tight"
          >
            Edit profile
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your name or profile photo. Changes appear across PizzaHub.
          </p>
        </div>
        <ProfileSettingsForm initialName={name} image={image} />
      </section>
    </Reveal>
  );
}
