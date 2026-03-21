export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} 101 STUDIOS. Built with passion.
      </p>
    </footer>
  );
}
