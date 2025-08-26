import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { PlusCircle } from "lucide-react";

type Student = {
  id: number;
  name: string;
  nic: string;
  school: string;
  phone: string;
  email: string;
  stream: string;
  rankingDistrict: string;
  examDistrict: string;
  examCenter: string;
  fee:number;
};

export default function ManualAdmissions() {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const streamOptions = [
    { label: "Maths", fee: 600 },
    { label: "Science", fee: 600 },
    { label: "ICT", fee: 200 },
    { label: "Maths and ICT", fee: 600 },
  ];
  const [form, setForm] = useState<Omit<Student, "id"|"fee">>({
    name: "",
    nic: "",
    school: "",
    phone: "",
    email: "",
    stream: "",
    rankingDistrict: "",
    examDistrict: "",
    examCenter: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Limit input to numbers only for NIC and phone
    if ((name === "nic" || name === "phone") && !/^\d*$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const getFee = (stream: string) => {
    const match = streamOptions.find((opt) => opt.label === stream);
    return match ? match.fee : 0;
  };

  const handleAddStudent = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.nic.trim().length !== 12) newErrors.nic = "NIC must be 12 digits";
    if (!form.school.trim()) newErrors.school = "School is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (form.phone.trim().length !== 10) newErrors.phone = "Phone must be 10 digits";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.stream.trim()) newErrors.stream = "Stream is required";
    if (!form.rankingDistrict.trim()) newErrors.rankingDistrict = "Ranking district is required";
    if (!form.examDistrict.trim()) newErrors.examDistrict = "Exam district is required";
    if (!form.examCenter.trim()) newErrors.examCenter = "Exam center is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
	const fee = getFee(form.stream);

    setStudents([
      ...students,
      { id: students.length + 1, ...form, fee },
    ]);

    setForm({
      name: "",
      nic: "",
      school: "",
      phone: "",
      email: "",
      stream: "",
      rankingDistrict: "",
      examDistrict: "",
      examCenter: "",
    });
    setErrors({});
    setOpen(false);
  };

  return (
    <div className="p-6">
      {/* Add Student Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
      >
        <PlusCircle size={18} />
        Add Student
      </button>

       {students.length > 0 && (
        <>
          <table className="mt-6 w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">ID</th>
                <th className="border px-2 py-1 text-left">Name</th>
                <th className="border px-2 py-1 text-left">NIC</th>
                <th className="border px-2 py-1 text-left">School</th>
                <th className="border px-2 py-1 text-left">Phone</th>
                <th className="border px-2 py-1 text-left">Email</th>
                <th className="border px-2 py-1 text-left">Stream</th>
                <th className="border px-2 py-1 text-left">Ranking District</th>
                <th className="border px-2 py-1 text-left">Exam District</th>
                <th className="border px-2 py-1 text-left">Exam Center</th>
                <th className="border px-2 py-1 text-left">Fee</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="border px-2 py-1">{student.id}</td>
                  <td className="border px-2 py-1">{student.name}</td>
                  <td className="border px-2 py-1">{student.nic}</td>
                  <td className="border px-2 py-1">{student.school}</td>
                  <td className="border px-2 py-1">{student.phone}</td>
                  <td className="border px-2 py-1">{student.email}</td>
                  <td className="border px-2 py-1">{student.stream}</td>
                  <td className="border px-2 py-1">{student.rankingDistrict}</td>
                  <td className="border px-2 py-1">{student.examDistrict}</td>
                  <td className="border px-2 py-1">{student.examCenter}</td>
                  <td className="border px-2 py-1">{student.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right font-bold text-blue-700">
            Total Collected: Rs.{" "}
            {students.reduce((sum, s) => sum + s.fee, 0)}
          </div>
        </>
      )}

      {/* Centered Popup */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl dark:bg-boxdark overflow-y-auto">
            <Dialog.Title className="text-2xl font-bold mb-6 text-center">
              Exam Registration
            </Dialog.Title>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {[
                { name: "name", label: "Name" },
                { name: "nic", label: "NIC" },
                { name: "school", label: "School" },
                { name: "phone", label: "Phone Number" },
                { name: "email", label: "Email" },
                { name: "stream", label: "Stream" },
                { name: "rankingDistrict", label: "Ranking District" },
                { name: "examDistrict", label: "Exam District" },
                { name: "examCenter", label: "Exam Center" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-white">
                    {field.label}
                  </label>
                  <input
                    type={field.name === "phone" || field.name === "nic" ? "tel" : "text"}
                    name={field.name}
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    maxLength={field.name === "phone" ? 10 : field.name === "nic" ? 12 : undefined}
                    className={`mt-1 w-full rounded border px-3 py-2 dark:bg-meta-4 dark:text-white ${
                      errors[field.name] ? "border-red-500" : "border-stroke"
                    }`}
                    required
                  />
                  {errors[field.name] && (
                    <span className="text-xs text-red-500 mt-1">{errors[field.name]}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
              >
                Register
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}  