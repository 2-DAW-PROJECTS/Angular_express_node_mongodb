// import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-shop',
//   standalone: true, // COMPONENTE STANDALONE
//   imports: [CommonModule],
//   templateUrl: './shop.component.html',
//   styleUrl: './shop.component.css'
// })
// export class ShopComponent {}


interface Product {
  id: number;
  name: string;
  salary: number;
  description: string;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  products: Product[] = [];

  ngOnInit() {
    // Mock data - replace with API call in the future
    this.products = [
      { id: 1, name: 'Frontend Developer', salary: 45000, description: 'Responsible for implementing visual elements that users see and interact with in a web application.' },
      { id: 2, name: 'Backend Developer', salary: 50000, description: 'Works on server-side web application logic and integration of the work frontend developers do.' },
      { id: 3, name: 'Data Analyst', salary: 40000, description: 'Interprets data and turns it into information which can offer ways to improve a business.' },
      { id: 4, name: 'Project Manager', salary: 55000, description: 'Oversees all aspects of project management including planning, execution, monitoring, and closure.' },
      { id: 5, name: 'UX/UI Designer', salary: 47000, description: 'Focuses on user interface and user experience design, ensuring an intuitive and engaging user experience.' },
      { id: 6, name: 'DevOps Engineer', salary: 60000, description: 'Responsible for bridging the gap between development and operations by automating processes and managing infrastructure.' },
      { id: 7, name: 'Software Tester', salary: 38000, description: 'Tests software to ensure it functions correctly and identifies any bugs or issues before release.' },
      { id: 8, name: 'Marketing Specialist', salary: 42000, description: 'Plans and executes marketing strategies to promote products or services and increase brand awareness.' },
      { id: 9, name: 'HR Specialist', salary: 39000, description: 'Handles recruitment, interviews, and employee relations, ensuring the organization hires and retains qualified staff.' },
      { id: 10, name: 'Business Analyst', salary: 53000, description: 'Analyzes business processes and data to identify trends and propose strategies for improvement.' },
    ];
  }
}


