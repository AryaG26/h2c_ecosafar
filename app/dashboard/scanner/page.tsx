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
  const [isLoading, setIsLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  const fetchProductData = async (scannedBarcode) => {
    const barcodeValue = scannedBarcode || barcode;

    if (!barcodeValue) {
      toast({
        title: "No barcode entered",
        description: "Please enter a barcode or scan one.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProduct(null);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcodeValue}.json`);
      const data = await response.json();

      if (data.status === 0) {
        setProduct({ error: "Sorry, no data found." });
        toast({
          title: "Product not found",
          description: "This barcode is not available in the Open Food Facts database.",
          variant: "destructive",
        });
      } else {
        const ecoData = data.product.ecoscore_data?.agribalyse || {};
        const equivalentTo = data.product.ecoscore_data?.co2_eq?.equivalent_to || 
                             data.product.ecoscore_data?.co2_eq_label || 
                             "Data Not Available";

        const productInfo = {
          name: data.product.product_name || "Data Not Available",
          brand: data.product.brands || "Data Not Available",
          category: data.product.categories || "Data Not Available",
          image: data.product.image_url || "/placeholder.svg",
          greenScore: data.product.ecoscore_score || "Data Not Available",
          impactGrade: data.product.ecoscore_grade?.toUpperCase() || "Data Not Available",
          carbonFootprint: ecoData.carbon_footprint || "Data Not Available",
          lifeCycleAnalysis: ecoData.co2_total || "Data Not Available",
          carbonEquivalent: equivalentTo,
        };

        setProduct(productInfo);
        toast({
          title: "Product Found",
          description: `Details for ${productInfo.name} retrieved successfully.`,
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct({ error: "Sorry, data not present" });
      toast({
        title: "Error",
        description: "An error occurred while fetching the product data.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
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
            <Input
              placeholder="Enter barcode number"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
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
                videoConstraints={{
                  facingMode: "environment", // Use the back camera
                }}
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
        </CardContent>
      </Card>

      {/* CSS for Flipping the Video Feed */}
      <style jsx>{`
        .mirrored-video video {
          transform: scaleX(-1); /* Flip the video horizontally */
        }
      `}</style>
    </div>
  );
}
