'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Camera, Mic, MapPin, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';

interface CitizenHomeProps {
  onReportSubmit: (report: any) => void;
  userId: string; // 🆔 Pass from parent/session
}

export default function CitizenHome() {
  const [isRecording, setIsRecording] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);  
  const {data : session} = useSession();
   const userId = session?.user?.id as string;
   console.log(session?.user.role);
   console.log(userId);
   
   
  // ✅ central form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    pincode: '',
    // userId:'',
    department:'',
    image: null as File | null,
  });

  const [ticketId, setTicketId] = useState<string | null>(null);

  const categories = [
    { id: 'potholes', label: 'Potholes', color: 'bg-orange-500' },
    { id: 'streetlight', label: 'Street Light', color: 'bg-yellow-500' },
    { id: 'garbage', label: 'Garbage', color: 'bg-green-600' },
    { id: 'water', label: 'Water Issue', color: 'bg-blue-500' },
    { id: 'other', label: 'Other', color: 'bg-gray-500' },
  ];

  // 🔹 Fetch location only when toggle is ON
  useEffect(() => {
    if (!locationEnabled) return;

    async function getLocationAndSend() {
      if (!navigator.geolocation) {
        alert('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const location = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            const res = await axios.get('/api/fetchcurrentlocation', {
              params: location,
            });
              console.log(res.data.postOffices?.Name);
              console.log(res.data.geoData);
              // const display_name = res.data.geoData.display_name.split[','];
              // const city = display_name[0];
              // console.log(city);
              
              
            if (res.data) {
              setFormData((prev) => ({
                ...prev,
                location: res.data.geoData.display_name.split(',')[0] || '',
                pincode: res.data.geoData.postcode || '',
              }));
            }

            console.log('📍 Pincode:', res.data.geoData.display_name.split(',')[3]);
            console.log('🏢 Post Office:', res.data.geoData.display_name.split(',')[0]);
          } catch (err) {
            console.error('❌ Error sending location', err);
          }
        },
        (err) => {
          console.error('❌ Error getting location', err);
          alert('Please allow location access.');
          setLocationEnabled(false); // reset toggle if denied
        }
      );
    }

    getLocationAndSend();
  }, [locationEnabled]);

  // 🔹 Image handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files && e.target.files[0] ? e.target.files[0] : null }));
    }
    // console.log(image);
    
  };

  const handleSubmit = async () => {
  if (!formData.description || !formData.category || !formData.image) return;

  setIsSubmitting(true);
  console.log("hi");
  

  try {
    // ⬇️ 1. Send the image to your FastAPI /predict endpoint first
    const predData = new FormData();
    predData.append('file', formData.image);

    // ⚠️ Use your real FastAPI URL here:
    // If running locally: http://127.0.0.1:8000/predict
    const predRes = await axios.post('http://127.0.0.1:8000/predict', predData);

    console.log('Prediction:', predRes.data);

    // ⬇️ 2. Check predicted_class
    if (predRes.data.predicted_class === 'fake') {
      alert('⚠️ This image seems to be fake. Report not submitted.');
      setIsSubmitting(false);
      return;
    }

    // ⬇️ 3. Continue submitting to your own API if not fake
    const generatedTicketId = `CIV${Date.now().toString().slice(-6)}`;
    setTicketId(generatedTicketId);

    const data = new FormData();
    data.append('userId', userId);
    data.append('ticketId', generatedTicketId);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('location', formData.location);
    data.append('pincode', formData.pincode);
    if (formData.image) data.append('image', formData.image);

    // department selection
    if (
      formData.category === 'potholes' ||
      formData.category === 'streetlight' ||
      formData.category === 'waterissue'
    ) {
      data.append('department', 'Engineering');
    }
    if (formData.category === 'garbage') {
      data.append('department', 'Health');
    }
    if (formData.category === 'other') {
      data.append('department', 'Firework');
    }

    await axios.post('/api/uploadpost', data);

    setShowSuccess(true);
    setIsSubmitting(false);
  } catch (err) {
    console.error('❌ Submit error', err);
    setIsSubmitting(false);
  }
};

// 🔹 Success Screen
if (ticketId && showSuccess) {
  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="text-center">
        <CardContent className="p-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl mb-2">Report Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Your civic issue has been reported successfully.
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Ticket #{ticketId}
          </Badge>

          <div className="mt-6">
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                setShowSuccess(false);
                setTicketId(null);
                setLocationEnabled(false);
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  location: '',
                  pincode: '',
                  department:'',
                  image: null,
                });
              }}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl mb-2">Report Civic Issue</h1>
        <p className="text-muted-foreground">Help make your city better</p>
      </div>

      {/* Camera / Upload Section */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Issue Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
              id="upload-photo"
            />
            <label htmlFor="upload-photo">
              <Button size="lg" className="w-full" asChild>
                <span>
                  <Camera className="w-5 h-5 mr-2" />
                  {formData.image ? 'Change Photo' : 'Capture Issue Photo'}
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Location Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Auto-detect Location</p>
                <p className="text-sm text-muted-foreground">
                  {locationEnabled
                    ? `Detected: ${formData.location || 'Loading...'}`
                    : 'Manual location entry'}
                </p>
              </div>
            </div>
            <Switch
              checked={locationEnabled}
              onCheckedChange={setLocationEnabled}
            />
          </div>

          {!locationEnabled && (
            <input
              type="text"
              placeholder="Enter your location / pincode"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className="mt-3 w-full border rounded-lg p-2"
            />
          )}
        </CardContent>
      </Card>

      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={formData.category === cat.id ? 'default' : 'outline'}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, category: cat.id }))
                }
                className="h-12"
              >
                <div className={`w-3 h-3 rounded-full ${cat.color} mr-2`} />
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description Input */}
      <Card>
        <CardHeader>
          <CardTitle>Describe the Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe what you see..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? 'bg-red-50 border-red-200' : ''}
            >
              <Mic
                className={`w-4 h-4 mr-2 ${
                  isRecording ? 'text-red-500' : ''
                }`}
              />
              {isRecording ? 'Stop Recording' : 'Voice Input'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!formData.description || !formData.category || isSubmitting || userId === undefined}
        size="lg"
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit Report
          </>
        )}
      </Button>
    </div>
  );
}
