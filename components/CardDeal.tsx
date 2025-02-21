import { bill } from "@/public/assets";
import styles, { layout } from "@/styles/style";
import Button from "./Button";
import Image from "next/image";
const CardDeal: React.FC = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
      Optimize Your Workflow & Communication  
      </h2>
      <p className={`${styles.paragraph} max-w-[550px] mt-5`}>
      Boost productivity with AI-powered voice-to-action, real-time translation, and smart communication tools. Automate tasks, enhance collaboration, and stay efficient across any industry.  
      </p>
      <Button styles="mt-10" />
    </div>
    <div className={layout.sectionImg}>
      <Image src={bill} alt="card" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default CardDeal;
