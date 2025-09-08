import Footer from "../components/footer";

export default function ProjectLayout({ children }) {
  return (
      <div>
        {children}
        <Footer />
      </div>
  );
}
