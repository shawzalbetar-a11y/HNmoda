import { ProductForm } from "../product-form";
import { useLanguage } from "@/hooks/use-language";

export default function NewProductPage() {
  // We can't use the hook directly in a server component.
  // The form itself is a client component and will use it.
  const title = "Add New Product"; 
  const description = "Fill in the details below to add a new product to your catalog.";

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ProductForm />
    </div>
  );
}
