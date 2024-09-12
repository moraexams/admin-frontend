import { useState } from 'react';
//import { District } from '../../types/types';
import ReactPaginate from 'react-paginate';
import { addStudent, deleteStudent, updateStudent } from '../../services/studentService';
import { filterIt } from '../../services/filter';
