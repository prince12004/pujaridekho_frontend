"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { useGenerateKundli, useMyKundlis } from "@/features/account/api/use-kundli";
import { formatDate } from "@/features/account/lib/format";
import { getErrorMessage } from "@/features/account/lib/get-error-message";

export default function KundliListPage() {
  const { data, isLoading, isError, refetch } = useMyKundlis();
  const generateMutation = useGenerateKundli();
  const [open, setOpen] = useState(false);
  const [personName, setPersonName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");

  async function handleGenerate() {
    if (!personName || !dob || !tob || !place) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const record = await generateMutation.mutateAsync({ personName, dob, tob, place });
      toast.success("Kundli generated");
      setOpen(false);
      setPersonName("");
      setDob("");
      setTob("");
      setPlace("");
      window.location.href = `/account/kundli/${record._id}`;
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not generate Kundli"));
    }
  }

  const generateDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-ui font-bold">Generate New Kundli</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Kundli</DialogTitle>
          <DialogDescription>Enter accurate birth details for the most precise chart.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="person-name" className="mb-1.5">Name</Label>
            <Input id="person-name" placeholder="Full name" value={personName} onChange={(e) => setPersonName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="dob" className="mb-1.5">Date of Birth</Label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tob" className="mb-1.5">Time of Birth</Label>
            <Input id="tob" type="time" value={tob} onChange={(e) => setTob(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="place" className="mb-1.5">Place of Birth</Label>
            <Input id="place" placeholder="City, State" value={place} onChange={(e) => setPlace(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={generateMutation.isPending} className="font-ui font-bold">
            {generateMutation.isPending ? "Generating..." : "Generate Kundli"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      <AccountPageHeader title="My Kundli" description="Your saved birth charts." actions={data && data.length > 0 ? generateDialog : undefined} />

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <div className="space-y-4">
          <AccountEmptyState icon={Sparkles} title="No Kundli has been generated yet" description="Generate your first Kundli in a few seconds." />
          <div className="flex justify-center">{generateDialog}</div>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((record) => (
            <Link key={record._id} href={`/account/kundli/${record._id}`}>
              <Card className="transition hover:border-primary/40">
                <CardContent className="space-y-1 p-4">
                  <p className="font-heading text-sm font-bold text-secondary">{record.personName}</p>
                  <p className="text-xs text-muted-foreground">
                    Born {formatDate(record.dob)} · {record.tob}
                  </p>
                  <p className="text-xs text-muted-foreground">{record.place}</p>
                  <p className="mt-2 text-xs font-medium text-primary">Moon Sign: {record.moonRashi}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
