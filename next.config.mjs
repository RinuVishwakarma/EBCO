/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "temp-dev.ebco.in",
      "dashboard.ebco.in",
      "https://ebco.in/",
      "https://www.youtube.com/",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/qrcode/:path*",
        destination:
          "https://dashboard.ebco.in/wp-content/uploads/qrcode/:path*",
      },
      {
        source: "/download/:path*",
        destination:
          "https://dashboard.ebco.in/wp-content/uploads/download/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/kids-furniture-handle-plastic",
        destination: "/livsmart?selectedItem=Knobs",
        permanent: true,
      },
      {
        source:
          "/livsmart/aluminium-profiles-and-handles/handles-and-knobs/aluminium-handles",
        destination: "/livsmart?selectedItem=Aluminium%20Handles",
        permanent: true,
      },
      {
        source:
          "/livsmart/aluminium-profiles-and-handles/handles-and-knobs/zinc-handle",
        destination: "/livsmart?selectedItem=Zinc%20Handles",
        permanent: true,
      },
      {
        source: "/livsmart/Sofa_Quick_Bed",
        destination: "https://ebco.in/livsmart/sofa-quick-bed",
        permanent: true,
      },
      {
        source: "/livsmart/Sofa_Quick_Bed/:path*",
        destination: "https://ebco.in/livsmart/Sofa-Quick-Bed/:path*",
        permanent: true,
      },

    ];
  },
};

export default nextConfig;
