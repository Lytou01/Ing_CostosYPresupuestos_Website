import { useAbcStore } from "./store/abcStore";
import Header from "./components/layout/Header";
import Stepper from "./components/layout/Stepper";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import Step1Page from "./pages/Step1Page";
import Step2Page from "./pages/Step2Page";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  const step = useAbcStore((s) => s.step);
  const setStep = useAbcStore((s) => s.setStep);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {step !== "landing" && <Stepper currentStep={step} onStepClick={setStep} />}
      <main className="flex-1">
        {step === "landing" && <LandingPage />}
        {step === "step1" && <Step1Page />}
        {step === "step2" && <Step2Page />}
        {step === "results" && <ResultsPage />}
      </main>
      <Footer />
    </div>
  );
}