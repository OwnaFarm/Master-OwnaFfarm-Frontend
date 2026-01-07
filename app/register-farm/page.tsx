import { RegisterFarmForm } from "@/components/farmer/register-farm-form"
import { FormFloatingNav } from "@/components/landing/form-floating-nav"
import { RegisterFarmHeader } from "@/components/farmer/register-farm-header"
import { RegisterFarmSidebar } from "@/components/farmer/register-farm-sidebar"

export const metadata = {
  title: "Register Farm | OwnaFarm",
  description: "Register your farm and join the OwnaFarm platform to access funding from investors.",
}

export default function RegisterFarmPage() {
  return (
    <main className="min-h-screen bg-background">
      <FormFloatingNav />
      <RegisterFarmHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 lg:pl-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Left Side - Info */}
          <div className="lg:col-span-2">
            <RegisterFarmSidebar />
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-3">
            <RegisterFarmForm />
          </div>
        </div>
      </div>
    </main>
  )
}
