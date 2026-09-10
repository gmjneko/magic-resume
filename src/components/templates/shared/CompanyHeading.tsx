import ItemHeading from "./ItemHeading";

interface CompanyHeadingProps {
  company?: string;
  logo?: string;
  className?: string;
}

const CompanyHeading: React.FC<CompanyHeadingProps> = ({
  company,
  logo,
  className,
}) => {
  return <ItemHeading title={company} logo={logo} className={className} />;
};

export default CompanyHeading;
