import { useOutletContext } from "react-router";
import Clock from "../components/Clock.jsx";

export default function ClockPage() {
  const { dict } = useOutletContext();
  return <Clock dict={dict} />;
}
