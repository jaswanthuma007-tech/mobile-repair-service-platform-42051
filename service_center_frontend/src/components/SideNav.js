import React from "react";
import { NavLink } from "react-router-dom";

export default function SideNav() {
  return (
    <aside className="sideNav" aria-label="Service Center navigation">
      <div className="sideNav__brand">
        <div className="brandmark" aria-hidden="true" />
        <div>
          <div className="sideNav__name">Service Center</div>
          <div className="sideNav__tagline">Operations Console</div>
        </div>
      </div>

      <nav className="sideNav__links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "navItem navItem--active" : "navItem")}>
          Overview
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => (isActive ? "navItem navItem--active" : "navItem")}>
          Jobs
        </NavLink>
        <NavLink to="/technicians" className={({ isActive }) => (isActive ? "navItem navItem--active" : "navItem")}>
          Technicians
        </NavLink>
        <NavLink to="/spare-parts" className={({ isActive }) => (isActive ? "navItem navItem--active" : "navItem")}>
          Spare Parts
        </NavLink>
        <NavLink to="/billing" className={({ isActive }) => (isActive ? "navItem navItem--active" : "navItem")}>
          Billing
        </NavLink>
      </nav>
    </aside>
  );
}
