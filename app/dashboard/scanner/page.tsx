"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Camera } from "lucide-react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function ScannerPage() {
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [carbonReduction, setCarbonReduction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAlternatives, setIsFetchingAlternatives] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  const fetchProductData = async (scannedBarcode) => {
    const barcodeValue = scannedBarcode || barcode;
    if (!barcodeValue) {
      toast({ title: "No barcode entered", description: "Please enter or scan a barcode.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setProduct(null);
    setAlternatives([]);
    setSelectedAlternative(null);
    setCarbonReduction(null);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcodeValue}.json`);
      const data = await response.json();

      if (data.status === 0) {
        setProduct({ error: "No product data found." });
        toast({ title: "Product not found", description: "This barcode does not exist.", variant: "destructive" });
      } else {
        const ecoData = data.product.ecoscore_data?.agribalyse || {};
        const impactGrade = data.product.ecoscore_grade?.toUpperCase() || "N/A";

        setProduct({
          name: data.product.product_name || "Data Not Available",
          brand: data.product.brands || "Data Not Available",
          category: data.product.categories || "Data Not Available",
          image: data.product.image_url || "/placeholder.svg",
          greenScore: data.product.ecoscore_score || "N/A",
          impactGrade: impactGrade,
          carbonFootprint: ecoData.carbon_footprint || "N/A",
          lifeCycleAnalysis: ecoData.co2_total || "N/A",
        });

        toast({ title: "Product Found", description: `Details for ${data.product.product_name} retrieved.` });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({ title: "Error", description: "Failed to fetch product data.", variant: "destructive" });
    }

    setIsLoading(false);
  };

  const fetchAlternativeProducts = async () => {
    if (!product?.category) return;

    setIsFetchingAlternatives(true);
    setAlternatives([]);
    setSelectedAlternative(null);
    setCarbonReduction(null);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(product.category)}&json=true`
      );
      const data = await response.json();

      if (data.products) {
        const betterOptions = data.products
          .filter((prod) => prod.ecoscore_grade?.toUpperCase() === "A" || prod.ecoscore_grade?.toUpperCase() === "B")
          .slice(0, 3)
          .map((prod) => ({
            name: prod.product_name || "Unknown",
            brand: prod.brands || "Unknown",
            image: prod.image_url || "/placeholder.svg",
            impactGrade: prod.ecoscore_grade?.toUpperCase() || "Unknown",
            greenScore: prod.ecoscore_score || "N/A",
            carbonFootprint:
              prod.ecoscore_data?.agribalyse?.carbon_footprint ||
              prod.ecoscore_data?.agribalyse?.co2_total ||
              "N/A",
          }));

        setAlternatives(betterOptions.length > 0 ? betterOptions : [{ name: "No greener alternatives found." }]);
      }
    } catch (error) {
      console.error("Error fetching alternatives:", error);
    }

    setIsFetchingAlternatives(false);
  };

  const calculateCarbonReduction = () => {
    if (!product || !selectedAlternative) return;

    const originalCarbon = parseFloat(product.lifeCycleAnalysis) || 0;
    const alternativeCarbon = parseFloat(selectedAlternative.carbonFootprint) || 0;

    if (originalCarbon === 0 || alternativeCarbon === 0) {
      setCarbonReduction("N/A");
    } else {
      const reduction = originalCarbon - alternativeCarbon;
      setCarbonReduction(reduction.toFixed(2));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Product Scanner</h1>
      <Card>
        <CardHeader>
          <CardTitle>Scan Product Barcode</CardTitle>
          <CardDescription>Enter or scan a barcode to check its environmental impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Enter barcode number" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
            <Button onClick={() => fetchProductData()} disabled={isLoading}>
              <Search className="h-4 w-4" /> Search
            </Button>
            <Button onClick={() => setScanning(!scanning)}>
              <Camera className="h-4 w-4" /> {scanning ? "Stop Scan" : "Scan"}
            </Button>
          </div>
          {scanning && (
            <div className="mt-4 border p-2 rounded-lg">
              <BarcodeScannerComponent
                width={300}
                height={300}
                onUpdate={(err, result) => {
                  if (result) {
                    setScanning(false);
                    setBarcode(result.text);
                    fetchProductData(result.text);
                  }
                }}
                videoConstraints={{ facingMode: "environment" }}
                className="mirrored-video"
              />
            </div>
          )}

          {isLoading && <p className="mt-2 text-sm">Fetching product details...</p>}


          {product && (
            <div className="mt-4 border p-4 rounded-lg">
              {product.error ? (
                <p className="text-red-500 font-bold">{product.error}</p>
              ) : (
                <>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm">{product.brand} - {product.category}</p>
                  <p className="text-sm">🌱 Green Score: {product.greenScore}</p>
                  <p className="text-sm">📊 Impact Grade: {product.impactGrade}</p>
                  <p className="text-sm">♻ Carbon Footprint: {product.lifeCycleAnalysis} kg CO₂e</p>
                  <img src={product.image} alt={product.name} className="w-24 h-24 mt-2" />
                </>
              )}
            </div>
          )}

          {product && !product.error && (
            <Button onClick={fetchAlternativeProducts} className="mt-4">
              ♻ Show Greener Alternatives
            </Button>
          )}

          {isFetchingAlternatives && <p className="mt-2 text-sm">Fetching alternative products...</p>}

          {alternatives.length > 0 && (
            <div className="mt-4 border p-4 rounded-lg">
              <h3 className="font-bold">♻ Cleaner Alternatives</h3>
              {alternatives.map((alt, index) => (
                <div
                  key={index}
                  className={`mt-2 p-2 border rounded-lg cursor-pointer ${selectedAlternative === alt ? "border-green-500" : ""}`}
                  onClick={() => setSelectedAlternative(alt)}
                >
                  <p className="font-bold">{alt.name}</p>
                  <p className="text-sm">{alt.brand}</p>
                  <p className="text-sm">📊 Impact Grade: {alt.impactGrade}</p>
                  <p className="text-sm">🌱 Green Score: {alt.greenScore}</p>
                  <p className="text-sm">♻ Carbon Footprint: {alt.carbonFootprint} kg CO₂e</p>
                  <img src={alt.image} alt={alt.name} className="w-24 h-24 mt-2" />
                </div>
              ))}
            </div>
          )}

          {selectedAlternative && (
            <Button onClick={calculateCarbonReduction} className="mt-4">
              Calculate Carbon Reduction
            </Button>
          )}

          {carbonReduction !== null && (
            <p className="mt-2 text-sm font-bold">🌍 Carbon Emission Reduction: {carbonReduction} kg CO₂e</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
