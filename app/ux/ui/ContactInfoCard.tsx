"use client";

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const ContactInfoCard = ({ icon, title, children }: ContactInfoCardProps) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-navy/5 rounded-2xl hover:bg-navy/10 transition-colors">
      <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-navy">{title}</p>
        {children}
      </div>
    </div>
  );
};

export default ContactInfoCard;
