// Pakistan provinces + major cities, used to populate the Checkout shipping form.
// "Other" is appended in the UI (not here) so users can type a city that's missing.

export const PK_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Kashmir",
] as const;

export type PkProvince = (typeof PK_PROVINCES)[number];

export const PK_CITIES: Record<string, string[]> = {
  "Punjab": [
    "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot",
    "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang", "Rahim Yar Khan", "Gujrat",
    "Kasur", "Sahiwal", "Okara", "Wah Cantt", "Dera Ghazi Khan", "Mianwali",
    "Chiniot", "Kamoke", "Hafizabad", "Muzaffargarh", "Khanewal", "Vehari",
    "Jhelum", "Attock", "Chakwal", "Toba Tek Singh", "Pakpattan", "Layyah",
    "Bhakkar", "Nankana Sahib", "Narowal", "Mandi Bahauddin", "Bahawalnagar",
    "Lodhran", "Kot Addu",
  ],
  "Sindh": [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpur Khas",
    "Jacobabad", "Shikarpur", "Dadu", "Thatta", "Badin", "Khairpur", "Ghotki",
    "Sanghar", "Umerkot", "Tando Adam", "Tando Allahyar", "Kashmore", "Kambar",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Mingora (Swat)", "Abbottabad", "Kohat",
    "Dera Ismail Khan", "Bannu", "Swabi", "Nowshera", "Charsadda", "Mansehra",
    "Haripur", "Chitral", "Karak", "Hangu", "Tank", "Batagram", "Buner",
    "Lakki Marwat", "Malakand",
  ],
  "Balochistan": [
    "Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi", "Chaman", "Zhob", "Hub",
    "Dera Murad Jamali", "Loralai", "Mastung", "Kalat", "Pasni", "Ormara",
    "Panjgur", "Nushki",
  ],
  "Islamabad Capital Territory": ["Islamabad"],
  "Gilgit-Baltistan": [
    "Gilgit", "Skardu", "Hunza", "Ghanche", "Astore", "Diamer", "Ghizer", "Shigar",
  ],
  "Azad Kashmir": [
    "Muzaffarabad", "Mirpur", "Rawalakot", "Kotli", "Bhimber", "Bagh",
    "Neelum", "Hattian Bala",
  ],
};
