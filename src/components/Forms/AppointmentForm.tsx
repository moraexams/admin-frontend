import DatePickerOne from "./DatePicker/DatePickerOne";

const AppointmentForm = () => {
	return (
		<div className="col-span-5 xl:col-span-3">
			<div className="rounded-xs border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div className="p-7">
					<form action="#">
						{/* select doctor */}
						<div className="mb-5.5">
							<label
								className="mb-3 block text-sm font-medium text-black dark:text-white"
								htmlFor="selectDoctor"
							>
								Select Doctor
							</label>
							<select
								className="w-full rounded-sm border border-stroke bg-white py-3 px-4.5 text-black focus:border-primary focus-visible:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
								name="selectDoctor"
								id="selectDoctor"
							>
								<option value="Dr. John Doe">Dr. John Doe</option>
								<option value="Dr. Jane Doe">Dr. Jane Doe</option>
								<option value="Dr. Jane Doe">Dr. Win Cook</option>
							</select>
						</div>

						<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
							<div className="w-full sm:w-1/2">
								<DatePickerOne id="appointment-form-datepicker" />
							</div>

							<div className="w-full sm:w-1/2">
								<label
									className="mb-3 block text-sm font-medium text-black dark:text-white"
									htmlFor="Time"
								>
									Time
								</label>
								<input
									className="w-full rounded-sm border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-hidden dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
									type="time"
									name="time"
									id="time"
									defaultValue="13:00"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-4.5">
							<button
								className="flex justify-center rounded-sm border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
								type="submit"
							>
								Cancel
							</button>
							<button
								className="flex justify-center rounded-sm bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
								type="submit"
							>
								Request Appointment
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AppointmentForm;
