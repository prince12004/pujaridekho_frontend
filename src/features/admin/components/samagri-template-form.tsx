"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePoojas } from "@/features/admin/api/use-poojas";
import {
  CUSTOMER_ARRANGE_WHITELIST,
  SamagriTemplate,
  useCreateSamagriTemplate,
  useUpdateSamagriTemplate,
} from "@/features/admin/api/use-samagri-templates";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const includedItemSchema = z.object({
  itemName: z.string().min(1, "Required"),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  estimatedPrice: z.coerce.number().min(0),
  // Empty string means "unset" (falls back to estimatedPrice), not ₹0.
  mrp: z.preprocess((v) => (v === "" || v === undefined ? undefined : Number(v)), z.number().min(0).optional()),
  category: z.string().optional(),
  required: z.boolean().optional(),
});

const formSchema = z.object({
  samagriTemplateName: z.string().min(1, "Required"),
  pooja: z.string().min(1, "Select a pooja"),
  includedItems: z.array(includedItemSchema),
  customerArrangeItems: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export function SamagriTemplateForm({ template }: { template?: SamagriTemplate }) {
  const router = useRouter();
  const { data: poojasResult } = usePoojas({ limit: 100 });
  const createMutation = useCreateSamagriTemplate();
  const updateMutation = useUpdateSamagriTemplate();
  const [useCustomTotal, setUseCustomTotal] = useState(false);
  const [customTotal, setCustomTotal] = useState<number>(template?.estimatedSamagriCost ?? 0);
  const [useCustomMrpTotal, setUseCustomMrpTotal] = useState(false);
  const [customMrpTotal, setCustomMrpTotal] = useState<number>(template?.estimatedSamagriMrp ?? 0);
  const [customArrangeInput, setCustomArrangeInput] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof formSchema>, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      samagriTemplateName: template?.samagriTemplateName ?? "",
      pooja: typeof template?.pooja === "object" ? template.pooja._id : (template?.pooja ?? ""),
      includedItems: template?.includedItems ?? [],
      customerArrangeItems: template?.customerArrangeItems ?? [],
    },
  });

  const itemsArray = useFieldArray({ control, name: "includedItems" });
  const includedItems = watch("includedItems");
  const customerArrangeItems = watch("customerArrangeItems");
  const estimatedTotal = includedItems.reduce((sum, item) => sum + (Number(item.estimatedPrice) || 0), 0);
  // Falls back to estimatedPrice per item (i.e. no discount) when an item has no MRP set.
  const mrpItemsTotal = includedItems.reduce(
    (sum, item) => sum + (Number(item.mrp) || Number(item.estimatedPrice) || 0),
    0,
  );
  const finalMrpTotal = useCustomMrpTotal ? customMrpTotal : mrpItemsTotal;
  const finalOfferTotal = useCustomTotal ? customTotal : estimatedTotal;
  const percentOff = finalMrpTotal > 0 ? Math.round(((finalMrpTotal - finalOfferTotal) / finalMrpTotal) * 100) : 0;

  const toggleCustomerArrangeItem = (item: string, checked: boolean) => {
    if (checked) setValue("customerArrangeItems", [...customerArrangeItems, item]);
    else setValue("customerArrangeItems", customerArrangeItems.filter((i) => i !== item));
  };

  const addCustomArrangeItem = () => {
    const trimmed = customArrangeInput.trim();
    if (trimmed && !customerArrangeItems.includes(trimmed)) {
      setValue("customerArrangeItems", [...customerArrangeItems, trimmed]);
    }
    setCustomArrangeInput("");
  };

  const customArrangeItems = customerArrangeItems.filter(
    (item) => !(CUSTOMER_ARRANGE_WHITELIST as readonly string[]).includes(item),
  );

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: Record<string, unknown> = { ...values };
      if (useCustomTotal) payload.estimatedSamagriCost = customTotal;
      if (useCustomMrpTotal) payload.estimatedSamagriMrp = customMrpTotal;

      if (template) {
        await updateMutation.mutateAsync({ id: template._id, input: payload });
        toast.success("Samagri template updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Samagri template created");
        router.push("/admin/samagri-templates");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Template Name</Label>
            <Input {...register("samagriTemplateName")} placeholder="e.g. Satyanarayan Katha Samagri" />
            {errors.samagriTemplateName && <p className="text-xs text-destructive">{errors.samagriTemplateName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Linked Pooja</Label>
            <select {...register("pooja")} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none">
              <option value="">Select a pooja</option>
              {poojasResult?.items.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.pooja && <p className="text-xs text-destructive">{errors.pooja.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Included Items (Arranged by Pujari Dekho)</CardTitle>
            <p className="text-xs text-muted-foreground">
              On the booking page, the customer toggles &quot;Include Samagri&quot; on or off for the whole kit — when on,
              every item below is added and its total price is charged together.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              itemsArray.append({
                itemName: "",
                quantity: "",
                unit: "",
                estimatedPrice: 0,
                mrp: undefined,
                category: "",
                required: true,
              })
            }
          >
            <Plus /> Add item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {itemsArray.fields.length === 0 && <p className="text-sm text-muted-foreground">No items added yet.</p>}
          {itemsArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 rounded-lg border border-border p-3 md:grid-cols-8">
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Item name</Label>
                <Input {...register(`includedItems.${index}.itemName`)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Quantity</Label>
                <Input {...register(`includedItems.${index}.quantity`)} placeholder="e.g. 50" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unit</Label>
                <Input {...register(`includedItems.${index}.unit`)} placeholder="e.g. g, pcs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">MRP (₹)</Label>
                <Input
                  type="number"
                  {...register(`includedItems.${index}.mrp`)}
                  placeholder="Actual MRP"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Offer Price (₹)</Label>
                <Input type="number" {...register(`includedItems.${index}.estimatedPrice`)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Input {...register(`includedItems.${index}.category`)} placeholder="e.g. Havan" />
              </div>
              <div className="flex items-center justify-end">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => itemsArray.remove(index)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 gap-4 border-t border-border pt-3 sm:grid-cols-2">
            <div className="flex flex-col items-start gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actual MRP (total)</p>
              <p className="text-sm text-muted-foreground">Sum of item MRPs: ₹{mrpItemsTotal.toLocaleString("en-IN")}</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useCustomMrpTotal}
                  onChange={(e) => setUseCustomMrpTotal(e.target.checked)}
                />
                Set a custom MRP total
              </label>
              {useCustomMrpTotal ? (
                <Input
                  type="number"
                  className="w-32"
                  value={customMrpTotal}
                  onChange={(e) => setCustomMrpTotal(Number(e.target.value))}
                />
              ) : (
                <p className="text-sm font-semibold">Total MRP: ₹{mrpItemsTotal.toLocaleString("en-IN")}</p>
              )}
            </div>

            <div className="flex flex-col items-start gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pujari Dekho Offer Price (total)
              </p>
              <p className="text-sm text-muted-foreground">Sum of items above: ₹{estimatedTotal.toLocaleString("en-IN")}</p>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={useCustomTotal} onChange={(e) => setUseCustomTotal(e.target.checked)} />
                Set a custom total instead of using the sum of items
              </label>
              {useCustomTotal ? (
                <Input
                  type="number"
                  className="w-32"
                  value={customTotal}
                  onChange={(e) => setCustomTotal(Number(e.target.value))}
                />
              ) : (
                <p className="text-sm font-semibold">Offer Price: ₹{estimatedTotal.toLocaleString("en-IN")}</p>
              )}
            </div>
          </div>

          {finalMrpTotal > finalOfferTotal && (
            <p className="border-t border-border pt-2 text-right text-sm font-semibold text-emerald-600">
              {percentOff}% OFF vs MRP (₹{finalMrpTotal.toLocaleString("en-IN")} → ₹{finalOfferTotal.toLocaleString("en-IN")})
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Will Arrange</CardTitle>
          <p className="text-xs text-muted-foreground">
            Fresh/perishable items never bundled into a kit — shown to the customer as items they must arrange themselves.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {CUSTOMER_ARRANGE_WHITELIST.map((item) => (
              <label key={item} className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={customerArrangeItems.includes(item)}
                  onChange={(e) => toggleCustomerArrangeItem(item, e.target.checked)}
                />
                {item}
              </label>
            ))}
          </div>

          {customArrangeItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customArrangeItems.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-sm"
                >
                  {item}
                  <button type="button" onClick={() => toggleCustomerArrangeItem(item, false)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              value={customArrangeInput}
              onChange={(e) => setCustomArrangeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomArrangeItem();
                }
              }}
              placeholder="Add a custom item (e.g. Betel Nut)"
              className="max-w-xs"
            />
            <Button type="button" variant="outline" size="sm" onClick={addCustomArrangeItem}>
              <Plus /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {template ? "Save changes" : "Create template"}
        </Button>
      </div>
    </form>
  );
}
