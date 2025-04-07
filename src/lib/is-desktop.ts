import Device from "mobile-detect";

export default function isDesktop() {
	const device = new Device(window.navigator.userAgent);
	return !(device.mobile() || device.tablet() || device.phone());
}
