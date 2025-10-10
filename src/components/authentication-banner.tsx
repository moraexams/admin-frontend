import Logo from "../images/logo/logo.png";

export default function AuthenticationBanner() {
	return (
		<div className="py-15 lg:py-0 text-center">
			<div className="mb-5.5 inline-block">
				<img className="h-28 lg:h-36" src={Logo} alt="Logo" />
			</div>

			<p className="max-w-[32ch] text-pretty text-center mx-auto">
				Mora Exams' Dashboard.
				<br /> For managing students, marks, and etc.
			</p>
		</div>
	);
}
