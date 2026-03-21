import {
  Star,
  Eye,
  MoreHorizontal,
 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export type ApplicantStatus =
  | "Applied"
  | "Shortlisted"
  | "Approved"
  | "Rejected";

export type Applicant = {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  applied: string;
  status: ApplicantStatus;
};

type Props = {
  applicants: Applicant[];
  onStatusChange: (
    id: number,
    status: ApplicantStatus
  ) => void;
};

const RecentApplicants = ({
  applicants,
  onStatusChange,
}: Props) => {
  const [openMenu, setOpenMenu] =
    useState<number | null>(null);
  const [confirmRejectId, setConfirmRejectId] =
    useState<number | null>(null);

  const menuRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenu(null);
      }
    };

    if (openMenu !== null) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [openMenu]);

  const statusStyles = {
    Applied: "bg-gray-100 text-gray-600",
    Shortlisted: "bg-green-50 text-green-600",
    Approved: "bg-blue-50 text-blue-600",
    Rejected: "bg-red-50 text-red-600",
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-gray-800 font-semibold text-lg">
            Recent Applicants
          </h3>
        </div>

        <div className="grid grid-cols-5 px-6 py-3 text-sm text-gray-500 font-medium border-b border-gray-100">
          <span>Applicant</span>
          <span>Rating</span>
          <span>Applied</span>
          <span>Status</span>
          <span className="text-right">
            Actions
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {applicants.map((app) => (
            <div
              key={app.id}
              className="grid grid-cols-5 items-center px-6 py-4 hover:bg-gray-50 relative"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {app.name}
                </p>
                <p className="text-sm text-gray-500">
                  {app.role}
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Star
                  size={14}
                  className="text-yellow-400 fill-yellow-400"
                />
                {app.rating} ({app.reviews})
              </div>

              <p className="text-sm text-gray-500">
                {app.applied}
              </p>

              <span
                className={`text-sm px-3 py-1 rounded-md w-fit ${statusStyles[app.status]}`}
              >
                {app.status}
              </span>

              <div className="relative flex justify-end items-center gap-4">
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600">
                  <Eye size={16} />
                  View
                </button>

                <button
                  onClick={() =>
                    setOpenMenu(
                      openMenu === app.id
                        ? null
                        : app.id
                    )
                  }
                  className="text-gray-500 hover:text-green-600"
                >
                  <MoreHorizontal size={18} />
                </button>

                {openMenu === app.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg w-44 z-20 animate-fadeIn"
                  >
                    <button
                      onClick={() =>
                        onStatusChange(
                          app.id,
                          "Shortlisted"
                        )
                      }
                      className="w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 text-sm"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() =>
                        onStatusChange(
                          app.id,
                          "Approved"
                        )
                      }
                      className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        setConfirmRejectId(
                          app.id
                        );
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmRejectId !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-96 p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">
              Reject Applicant?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmRejectId(null)
                }
                className="px-4 py-2 bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onStatusChange(
                    confirmRejectId,
                    "Rejected"
                  );
                  setConfirmRejectId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentApplicants;