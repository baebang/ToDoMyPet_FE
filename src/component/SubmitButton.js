import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';

function SubmitButton(route) {
  return (
    <TouchableOpacity
      style={[
        styles.submitbutton,
        {backgroundColor: route.state ? '#1DC2FF' : '#D0D0D0'},
      ]}
      disabled={!route.state}
      onPress={route.onPress}>
      <Text style={styles.sudmittext}>{route.comment}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  submitbutton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  sudmittext: {
    color: 'white', // 원하는 버튼 텍스트 색상으로 변경
    fontSize: 18,
  },
});
export default SubmitButton;
