"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { authClient } from "@/lib/auth-client"
import { Crown, Info } from "lucide-react"
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  Loader2,
  MapPin,
  Wallet,
  ImagePlus,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const serviceCategories = [
  "Photography",
  "Videography",
  "Catering",
  "Venue",
  "Decoration",
  "Makeup",
  "Music",
  "Others",
]

export default function AddServicePage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const currentPlan =
    (session?.user as { plan?: string } | undefined)?.plan || "free"
  const isFreePlan = currentPlan === "free"

  const [loading, setLoading] = useState(false)
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    async function loadActiveCount() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services/vendor/my-services",
          { credentials: "include", cache: "no-store" }
        )

        const result = await response.json()

        if (response.ok && result.success && Array.isArray(result.data)) {
          setActiveCount(
            result.data.filter(
              (service: { isActive?: boolean }) => service.isActive === true
            ).length
          )
        }
      } catch {
        // The backend still enforces the limit on create
      }
    }

    void loadActiveCount()
  }, [])

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    price: "",
  })

  const [images, setImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.")
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image size must be less than 8 MB.")
      return
    }

    if (images.length >= 5) {
      toast.error("You can upload a maximum of 5 images.")
      return
    }

    setUploadingImage(true)

    const toastId = toast.loading("Uploading image...")

    try {
      const formData = new FormData()

      formData.append("image", file)

      const response = await fetch("http://localhost:5000/api/upload/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Image upload failed.")
      }

      const imageUrl = result.data.url

      setImages((previous) => [...previous, imageUrl])

      toast.success("Image uploaded successfully!", {
        id: toastId,
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image.",
        {
          id: toastId,
        }
      )
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isFreePlan && activeCount >= 3) {
      toast.error(
        "Free plan allows a maximum of 3 active services. Upgrade to Premium to add more."
      )
      router.push("/vendor/dashboard/subscription")
      return
    }

    if (!formData.category) {
      toast.error("Please select a service category.")
      return
    }

    if (
      Number(formData.price) <= 0 ||
      !Number.isFinite(Number(formData.price))
    ) {
      toast.error("Please enter a valid service price.")
      return
    }

    const toastId = toast.loading("Creating your service...")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          location: formData.location.trim(),
          price: Number(formData.price),
          images,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create service.")
      }

      toast.success("Service created successfully!", {
        id: toastId,
      })

      router.push("/vendor/dashboard/my-services")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
        {
          id: toastId,
        }
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#DDF2FD]/50 px-4 py-8 text-[#164863] sm:px-6 sm:py-12 lg:px-8 dark:bg-[#0B1020] dark:text-[#DDF2FD]">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#9BBEC8]/30 blur-3xl dark:bg-[#427D9D]/20" />

        <div className="absolute top-1/3 right-0 h-72 w-72 rounded-full bg-[#427D9D]/10 blur-3xl dark:bg-[#164863]/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link
            href="/vendor/dashboard"
            className="mb-7 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#427D9D] transition-colors hover:bg-[#DDF2FD] hover:text-[#164863] focus-visible:ring-2 focus-visible:ring-[#427D9D] focus-visible:outline-none dark:text-[#9BBEC8] dark:hover:bg-[#164863]/30 dark:hover:text-[#DDF2FD]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-8"
        >
          <h1 className="text-center text-3xl font-bold tracking-tight text-[#164863] sm:text-4xl dark:text-[#DDF2FD]">
            Add a new service
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#427D9D] sm:text-base dark:text-[#9BBEC8]">
            Share your wedding service with couples and help them plan their
            special day with confidence.
          </p>
        </motion.header>

        {/* Plan limit banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-[#9BBEC8]/60 bg-[#DDF2FD]/80 p-4 sm:flex-row sm:items-center dark:border-[#427D9D]/30 dark:bg-[#164863]/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#164863] text-[#DDF2FD]">
              {isFreePlan ? (
                <Info className="h-5 w-5" />
              ) : (
                <Crown className="h-5 w-5" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
                {isFreePlan
                  ? `Free Plan — ${activeCount}/3 active services used`
                  : "Premium Plan — unlimited active services"}
              </p>
              <p className="mt-0.5 text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                {isFreePlan
                  ? "New services start as pending and require admin approval."
                  : "Your Premium plan lets you publish without a service limit."}
              </p>
            </div>
          </div>

          {isFreePlan && (
            <Link
              href="/vendor/dashboard/subscription"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#164863] hover:underline dark:text-[#DDF2FD]"
            >
              <Crown className="h-4 w-4" />
              Upgrade to Premium
            </Link>
          )}
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.16,
            ease: "easeOut",
          }}
        >
          <Card className="overflow-hidden rounded-2xl border border-[#9BBEC8]/60 bg-white/95 p-0 shadow-xl shadow-[#164863]/10 backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-[#164863]/15 dark:border-[#427D9D]/40 dark:bg-[#111827]/95">
            <CardHeader className="border-b border-[#9BBEC8]/40 bg-[#DDF2FD]/70 px-5 py-6 sm:px-8 dark:border-[#427D9D]/30 dark:bg-[#164863]/25">
              <CardTitle className="text-xl font-bold text-[#164863] dark:text-[#DDF2FD]">
                Service information
              </CardTitle>

              <CardDescription className="leading-6 text-[#427D9D] dark:text-[#9BBEC8]">
                Add clear details so customers know exactly what you offer.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 py-7 sm:px-8 sm:py-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="font-semibold text-[#164863] dark:text-[#DDF2FD]"
                  >
                    Service name <span className="text-[#427D9D]">*</span>
                  </Label>

                  <div className="relative">
                    <BriefcaseBusiness className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#427D9D]" />

                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Premium wedding photography"
                      required
                      maxLength={100}
                      className="h-12 rounded-xl border-[#9BBEC8]/70 bg-white pl-10 text-[#164863] transition-all placeholder:text-[#9BBEC8] focus-visible:border-[#427D9D] focus-visible:ring-[#427D9D]/25 dark:bg-[#0B1020] dark:text-[#DDF2FD]"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="font-semibold text-[#164863] dark:text-[#DDF2FD]">
                    Service category <span className="text-[#427D9D]">*</span>
                  </Label>

                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((previous) => ({
                        ...previous,
                        category: value ?? "",
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 w-full rounded-xl border-[#9BBEC8]/70 bg-white text-[#164863] focus:ring-[#427D9D]/25 dark:bg-[#0B1020] dark:text-[#DDF2FD]">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>

                    <SelectContent className="border-[#9BBEC8]/60">
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "Venue"
                            ? "Wedding venue"
                            : category === "Makeup"
                              ? "Makeup artist"
                              : category === "Music"
                                ? "Music & entertainment"
                                : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                    Select the category that best describes your service.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="font-semibold text-[#164863] dark:text-[#DDF2FD]"
                  >
                    Description <span className="text-[#427D9D]">*</span>
                  </Label>

                  <div className="relative">
                    <FileText className="pointer-events-none absolute top-3.5 left-3 h-4 w-4 text-[#427D9D]" />

                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your experience, package details, and what makes your service special..."
                      required
                      minLength={10}
                      maxLength={1000}
                      rows={5}
                      className="min-h-32 resize-y rounded-xl border-[#9BBEC8]/70 bg-white pl-10 text-[#164863] transition-all placeholder:text-[#9BBEC8] focus-visible:border-[#427D9D] focus-visible:ring-[#427D9D]/25 dark:bg-[#0B1020] dark:text-[#DDF2FD]"
                    />
                  </div>

                  <p className="text-right text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                    {formData.description.length}/1000
                  </p>
                </div>

                {/* Service Images */}
                <div className="space-y-3">
                  <Label className="font-semibold text-[#164863] dark:text-[#DDF2FD]">
                    Service Images
                  </Label>

                  <p className="text-sm text-[#427D9D] dark:text-[#9BBEC8]">
                    Upload images of your wedding service. Maximum 5 images, 8
                    MB each.
                  </p>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {images.map((image, index) => (
                        <div
                          key={image}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-[#9BBEC8]/60"
                        >
                          <img
                            src={image}
                            alt={`Service image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setImages((previous) =>
                                previous.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  {images.length < 5 && (
                    <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#9BBEC8] bg-[#DDF2FD]/40 transition hover:border-[#427D9D] hover:bg-[#DDF2FD]/70 dark:border-[#427D9D]/50 dark:bg-[#164863]/10">
                      {uploadingImage ? (
                        <Loader2 className="h-8 w-8 animate-spin text-[#427D9D]" />
                      ) : (
                        <ImagePlus className="h-8 w-8 text-[#427D9D]" />
                      )}

                      <span className="text-sm font-semibold text-[#164863] dark:text-[#DDF2FD]">
                        {uploadingImage
                          ? "Uploading image..."
                          : "Click to upload image"}
                      </span>

                      <span className="text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                        JPG, PNG, WEBP up to 8 MB
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  )}

                  <p className="text-xs text-[#427D9D] dark:text-[#9BBEC8]">
                    {images.length}/5 images uploaded
                  </p>
                </div>

                {/* Location and price */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="font-semibold text-[#164863] dark:text-[#DDF2FD]"
                    >
                      Service location <span className="text-[#427D9D]">*</span>
                    </Label>

                    <div className="relative">
                      <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#427D9D]" />

                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Dhaka, Bangladesh"
                        required
                        className="h-12 rounded-xl border-[#9BBEC8]/70 bg-white pl-10 text-[#164863] transition-all placeholder:text-[#9BBEC8] focus-visible:border-[#427D9D] focus-visible:ring-[#427D9D]/25 dark:bg-[#0B1020] dark:text-[#DDF2FD]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="font-semibold text-[#164863] dark:text-[#DDF2FD]"
                    >
                      Price (BDT) <span className="text-[#427D9D]">*</span>
                    </Label>

                    <div className="relative">
                      <Wallet className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#427D9D]" />

                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="1"
                        step="1"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price in ৳"
                        required
                        className="h-12 rounded-xl border-[#9BBEC8]/70 bg-white pl-10 text-[#164863] transition-all placeholder:text-[#9BBEC8] focus-visible:border-[#427D9D] focus-visible:ring-[#427D9D]/25 dark:bg-[#0B1020] dark:text-[#DDF2FD]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="border-t border-[#9BBEC8]/40 pt-6 dark:border-[#427D9D]/30">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-[#164863] text-base font-semibold text-white shadow-md shadow-[#164863]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#427D9D] hover:shadow-lg hover:shadow-[#427D9D]/20 focus-visible:ring-2 focus-visible:ring-[#427D9D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating service...
                      </>
                    ) : (
                      <>Create service</>
                    )}
                  </Button>

                  <p className="mt-4 text-center text-xs leading-5 text-[#427D9D] dark:text-[#9BBEC8]">
                    Your service will be submitted for admin approval before it
                    becomes visible to customers.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 rounded-xl border border-[#9BBEC8]/60 bg-[#DDF2FD]/80 p-4 dark:border-[#427D9D]/30 dark:bg-[#164863]/20"
        >
          <p className="text-sm leading-6 text-[#164863] dark:text-[#DDF2FD]">
            <span className="font-bold text-[#427D9D]">Tip:</span> Keep your
            service details and price accurate. A clear listing helps couples
            choose the right vendor for their wedding.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
