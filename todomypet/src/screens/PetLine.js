import React, {useEffect, useState} from 'react';
import {petLineShow} from '../service/PetService';

export const petLineContent = petLineShow();


export function PetLineMain(petPersonalitys) {
  const petContent = petLineContent._j;

  // Check if petContent exists before accessing its properties
  if (petContent && petContent.mainPageRandomLine) {
    const proteinLines = petContent.mainPageRandomLine[petPersonalitys];
    if (proteinLines && proteinLines.length > 0) {
      const randomIndex = Math.floor(Math.random() * proteinLines.length);
      return proteinLines[randomIndex];
    }
  }
  // Return a default value or handle the case where petContent or its properties are null
  return '';
}


export function PetLineEvolution(petPersonalitys) {
  const petContent = petLineContent._j;

  // Check if petContent exists before accessing its properties
  if (petContent && petContent.upgrade) {
    const proteinLines = petContent.upgrade[petPersonalitys];
    return proteinLines
  }
  // Return a default value or handle the case where petContent or its properties are null
  return '';
}


export function PetLineFirst(petPersonalitys) {
  const petContent = petLineContent._j;

  // Check if petContent exists before accessing its properties
  if (petContent && petContent.firstMeet) {
    const proteinLines = petContent.firstMeet[petPersonalitys];
    return proteinLines
  }
  // Return a default value or handle the case where petContent or its properties are null
  return '';
}

export function PetResign(petPersonalitys){
  const petContent = petLineContent._j;

  // Check if petContent exists before accessing its properties
  if (petContent && petContent.resign) {
    const proteinLines = petContent.resign[petPersonalitys];
    return proteinLines
  }
  // Return a default value or handle the case where petContent or its properties are null
  return '';
}
