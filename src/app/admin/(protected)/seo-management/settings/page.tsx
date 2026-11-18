"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { type SeoSettings, useResetSeoSettings, useSaveSeoSettings, useSeoSettings } from "@/features/admin/api/use-seo-management";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

type Landing = SeoSettings["landing"];
type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

const LANDING_FIELDS: { group: string; fields: { key: StringKeys<Landing>; label: string; long?: boolean }[] }[] = [
  {
    group: "Buttons & WhatsApp",
    fields: [
      { key: "bookButtonLabel", label: "Book button label" },
      { key: "whatsappButtonLabel", label: "WhatsApp button label" },
      { key: "whatsappMessage", label: "Pre-filled WhatsApp message", long: true },
    ],
  },
  {
    group: "Puja services section",
    fields: [
      { key: "servicesEyebrow", label: "Small label (home pages)" },
      { key: "businessServicesEyebrow", label: "Small label (office / service pages)" },
      { key: "servicesHeading", label: "Heading" },
      { key: "servicesHeadingNoPlace", label: "Heading when the page has no location" },
      { key: "coverageHeading", label: "'Areas we cover' box heading" },
    ],
  },
  {
    group: "Why choose & booking steps",
    fields: [
      { key: "whyEyebrow", label: "Why-choose small label" },
      { key: "whyHeading", label: "Why-choose heading" },
      { key: "stepsEyebrow", label: "Steps small label" },
      { key: "stepsHeading", label: "Steps heading" },
    ],
  },
  {
    group: "Reviews, FAQs & links",
    fields: [
      { key: "reviewsEyebrow", label: "Reviews small label" },
      { key: "reviewsHeading", label: "Reviews heading" },
      { key: "faqEyebrow", label: "FAQ small label" },
      { key: "faqHeading", label: "FAQ heading" },
      { key: "faqHeadingNoPlace", label: "FAQ heading when no location" },
      { key: "relatedHeadingHome", label: "Related links heading (location pages)" },
      { key: "relatedHeadingBusiness", label: "Related links heading (office / service pages)" },
      { key: "nearbyHeading", label: "Nearby locations heading" },
      { key: "citiesHeading", label: "Cities heading (service pages)" },
    ],
  },
  {
    group: "Basic city page (city without a written SEO page — always noindex)",
    fields: [
      { key: "cityFallbackHeading", label: "H1" },
      { key: "cityFallbackIntro", label: "Intro", long: true },
      { key: "cityFallbackMetaTitle", label: "Meta title" },
      { key: "cityFallbackMetaDescription", label: "Meta description", long: true },
    ],
  },
  {
    group: "Final call-to-action",
    fields: [
      { key: "finalCtaEyebrow", label: "Small label" },
      { key: "finalCtaHeading", label: "Heading" },
      { key: "finalCtaHeadingNoPlace", label: "Heading when no location" },
      { key: "finalCtaText", label: "Text", long: true },
    ],
  },
];

function TitledList({
  label,
  items,
  onChange,
  max = 8,
}: {
  label: string;
  items: { title: string; text: string }[];
  onChange: (items: { title: string; text: string }[]) => void;
  max?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {items.length < max ? (
          <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, { title: "", text: "" }])}>
            <Plus /> Add
          </Button>
        ) : null}
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 rounded-lg border border-border p-2.5">
          <span className="pt-2 text-xs font-bold text-muted-foreground">{i + 1}</span>
          <div className="flex-1 space-y-2">
            <Input value={item.title} placeholder="Title" onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
            <Textarea rows={2} value={item.text} placeholder="Text" onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove">
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function SeoContentSettingsPage() {
  const { data, isLoading } = useSeoSettings();
  const save = useSaveSeoSettings();
  const reset = useResetSeoSettings();
  const [form, setForm] = useState<SeoSettings | null>(null);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const setLanding = (patch: Partial<Landing>) => setForm({ ...form, landing: { ...form.landing, ...patch } });
  const setDirectory = (patch: Partial<SeoSettings["directory"]>) => setForm({ ...form, directory: { ...form.directory, ...patch } });
  const setFooter = (patch: Partial<SeoSettings["footer"]>) => setForm({ ...form, footer: { ...form.footer, ...patch } });

  const onSave = async () => {
    try {
      const cleaned: SeoSettings = {
        ...form,
        landing: {
          ...form.landing,
          whyItems: form.landing.whyItems.filter((i) => i.title.trim() || i.text.trim()),
          steps: form.landing.steps.filter((i) => i.title.trim() || i.text.trim()),
        },
        footer: { ...form.footer, trustBadges: form.footer.trustBadges.map((b) => b.trim()).filter(Boolean) },
      };
      setForm(await save.mutateAsync(cleaned));
      toast.success("Saved — live on the website within a few minutes");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onReset = async () => {
    if (!confirm("Reset all page content settings to the original text?")) return;
    try {
      setForm(await reset.mutateAsync());
      toast.success("Reset to original text");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="pb-20">
      <AdminPageHeader
        title="Page Content Settings"
        description="Shared text on every SEO landing page, the /seo-pages directory and the website footer. Use {place} where the city / society name should appear, and {year} for the current year."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={onReset} disabled={reset.isPending}>
              <RotateCcw /> Reset
            </Button>
            <Button onClick={onSave} disabled={save.isPending}>
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-6">
          {LANDING_FIELDS.map((section) => (
            <Card key={section.group}>
              <CardHeader>
                <CardTitle>Landing pages — {section.group}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {section.fields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label>{f.label}</Label>
                    {f.long ? (
                      <Textarea rows={2} value={form.landing[f.key]} onChange={(e) => setLanding({ [f.key]: e.target.value } as Partial<Landing>)} />
                    ) : (
                      <Input value={form.landing[f.key]} onChange={(e) => setLanding({ [f.key]: e.target.value } as Partial<Landing>)} />
                    )}
                  </div>
                ))}
                {section.group === "Why choose & booking steps" ? (
                  <>
                    <TitledList label="Why-choose cards" items={form.landing.whyItems} onChange={(whyItems) => setLanding({ whyItems })} />
                    <TitledList label="Booking steps" items={form.landing.steps} onChange={(steps) => setLanding({ steps })} />
                  </>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO directory page (/seo-pages)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="space-y-1">
                <Label>Page title (H1 and meta title)</Label>
                <Input value={form.directory.title} onChange={(e) => setDirectory({ title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea rows={4} value={form.directory.description} onChange={(e) => setDirectory({ description: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Office group title</Label>
                  <Input value={form.directory.officeGroupTitle} onChange={(e) => setDirectory({ officeGroupTitle: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Services group title</Label>
                  <Input value={form.directory.servicesGroupTitle} onChange={(e) => setDirectory({ servicesGroupTitle: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Text when no pages are live</Label>
                <Input value={form.directory.emptyText} onChange={(e) => setDirectory({ emptyText: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website footer</CardTitle>
              <p className="text-xs text-muted-foreground">
                Footer link columns and text blocks are edited in Footer SEO Links; contact details in Website Settings.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="space-y-1">
                <Label>Text under the logo</Label>
                <Textarea rows={3} value={form.footer.blurb} onChange={(e) => setFooter({ blurb: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Book button label</Label>
                  <Input value={form.footer.bookButtonLabel} onChange={(e) => setFooter({ bookButtonLabel: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Book button link</Label>
                  <Input value={form.footer.bookButtonUrl} onChange={(e) => setFooter({ bookButtonUrl: e.target.value })} placeholder="/poojas" />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Newsletter title</Label>
                <Input value={form.footer.newsletterTitle} onChange={(e) => setFooter({ newsletterTitle: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Newsletter text</Label>
                <Input value={form.footer.newsletterText} onChange={(e) => setFooter({ newsletterText: e.target.value })} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Trust badges</Label>
                  {form.footer.trustBadges.length < 6 ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => setFooter({ trustBadges: [...form.footer.trustBadges, ""] })}>
                      <Plus /> Add
                    </Button>
                  ) : null}
                </div>
                {form.footer.trustBadges.map((badge, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={badge} onChange={(e) => setFooter({ trustBadges: form.footer.trustBadges.map((b, j) => (j === i ? e.target.value : b)) })} />
                    <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove" onClick={() => setFooter({ trustBadges: form.footer.trustBadges.filter((_, j) => j !== i) })}>
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <Label>Copyright line</Label>
                <Input value={form.footer.copyright} onChange={(e) => setFooter({ copyright: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.footer.showAllLocationsLink} onChange={(e) => setFooter({ showAllLocationsLink: e.target.checked })} />
                Show &quot;All Locations&quot; link in the bottom bar
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
